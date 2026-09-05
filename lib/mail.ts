import net from 'net';
import tls from 'tls';

export interface MailLead {
  to: string;
  subject: string;
  text: string;
}

function env(key: string): string {
  return process.env[key]?.trim() ?? '';
}

export function isMailConfigured(): boolean {
  return Boolean(env('SMTP_HOST') || env('LEAD_WEBHOOK_URL'));
}

export async function sendLead(lead: MailLead): Promise<void> {
  const webhook = env('LEAD_WEBHOOK_URL');
  if (webhook) {
    const res = await fetch(webhook, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(lead),
    });
    if (!res.ok) throw new Error(`WEBHOOK_HTTP_${res.status}`);
    return;
  }
  if (!env('SMTP_HOST')) throw new Error('MAIL_NOT_CONFIGURED');
  await smtpSend(lead);
}

function buildData(lead: MailLead, from: string): string[] {
  const body = Buffer.from(lead.text, 'utf8').toString('base64');
  const subject = Buffer.from(lead.subject, 'utf8').toString('base64');
  return [
    `From: <${from}>`,
    `To: <${lead.to}>`,
    `Subject: =?UTF-8?B?${subject}?=`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=utf-8',
    'Content-Transfer-Encoding: base64',
    '',
    body,
    '.',
  ];
}

export async function smtpSend(lead: MailLead): Promise<void> {
  const host = env('SMTP_HOST');
  if (!host) throw new Error('MAIL_NOT_CONFIGURED');

  const user = env('SMTP_USER');
  const pass = env('SMTP_PASS');
  const from = env('LEAD_FROM') || user || 'noreply';

  const requested = Number(env('SMTP_PORT') || 587);
  const secure: 'ssl' | 'starttls' | 'none' =
    env('SMTP_SECURE') === 'ssl' || requested === 465
      ? 'ssl'
      : env('SMTP_SECURE') === 'starttls' || requested === 587
        ? 'starttls'
        : 'none';
  const port = requested;

  return new Promise((resolve, reject) => {
    let conn: net.Socket = secure === 'ssl' ? tls.connect({ host, port }) : net.connect({ host, port });
    let buffer = '';
    let current: { code: string; last: string } | null = null;
    const queue: { expected: string; next: () => void }[] = [];
    let settled = false;

    const fail = (err: unknown) => {
      if (settled) return;
      settled = true;
      try { conn.destroy(); } catch { /* noop */ }
      reject(err instanceof Error ? err : new Error(String(err)));
    };

    const handle = (chunk: Buffer) => {
      buffer += chunk.toString('utf8');
      for (let nl = buffer.indexOf('\n'); nl !== -1; nl = buffer.indexOf('\n')) {
        const raw = buffer.slice(0, nl).replace(/\r$/, '');
        buffer = buffer.slice(nl + 1);
        const code = raw.slice(0, 3);
        const more = raw.length > 3 && raw[3] === '-';
        if (!current) current = { code, last: raw };
        current.last = raw;
        if (!more) {
          const reply = current;
          current = null;
          const entry = queue.shift();
          if (!entry) continue;
          if (reply.code.startsWith(entry.expected)) entry.next();
          else fail(new Error(`SMTP: expected ${entry.expected}*, got ${reply.code} — ${reply.last}`));
        }
      }
    };

    const attach = (socket: net.Socket) => {
      conn = socket;
      socket.setTimeout(15000, () => fail(new Error('SMTP timeout')));
      socket.on('error', fail);
      socket.on('data', handle);
    };

    const cmd = (lines: string[], expected: string): Promise<void> =>
      new Promise((resolveCmd, rejectCmd) => {
        if (settled) return rejectCmd(new Error('SMTP closed'));
        queue.push({ expected, next: resolveCmd });
        try {
          for (const line of lines) conn.write(line + '\r\n');
        } catch (err) {
          fail(err);
          rejectCmd(err instanceof Error ? err : new Error(String(err)));
        }
      });

    const connected = new Promise<void>((res, rej) => {
      conn.once('connect', res);
      conn.once('error', rej);
    });

    (async () => {
      attach(conn);
      await connected;
      await new Promise<void>(res => { queue.push({ expected: '2', next: res }); });

      await cmd(['EHLO god-beauty'], '2');
      if (secure === 'starttls') {
        await cmd(['STARTTLS'], '2');
        const upgraded = tls.connect({ socket: conn, host, servername: host });
        attach(upgraded);
        await new Promise<void>(res => { upgraded.once('secureConnect', res); });
        await cmd(['EHLO god-beauty'], '2');
      }
      if (user) {
        const cred = Buffer.from(`\0${user}\0${pass}`, 'utf8').toString('base64');
        await cmd([`AUTH PLAIN ${cred}`], '2');
      }
      await cmd([`MAIL FROM:<${from}>`], '2');
      await cmd([`RCPT TO:<${lead.to}>`], '2');
      await cmd(['DATA'], '3');
      await cmd(buildData(lead, from), '2');
      await cmd(['QUIT'], '2');
      settled = true;
      try { conn.end(); } catch { /* noop */ }
      resolve();
    })().catch(fail);
  });
}