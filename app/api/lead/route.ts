import type { NextRequest } from 'next/server';
import { isMailConfigured, sendLead } from '@/lib/mail';

export const runtime = 'nodejs';

const TOPIC_LABELS: Record<string, string> = {
  'nail-service': 'Ногтевой сервис',
  vizazh: 'Визаж',
  brow: 'Брови',
  lashes: 'Ресницы',
  pmu: 'Перманентный макияж',
  tattoo: 'Тату',
  course: 'Обучение',
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 6;
const attempts = new Map<string, number[]>();

function allow(ip: string): boolean {
  const now = Date.now();
  const list = (attempts.get(ip) ?? []).filter(t => now - t < WINDOW_MS);
  attempts.set(ip, list);
  return list.length < MAX_PER_WINDOW;
}

function json(data: Record<string, unknown>, status = 200): Response {
  return Response.json(data, { status });
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'local';
  if (!allow(ip)) return json({ ok: false, code: 'RATE_LIMITED' }, 429);

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ ok: false, code: 'BAD_REQUEST', message: 'Некорректный запрос.' }, 400);
  }
  if (!body || typeof body !== 'object') {
    return json({ ok: false, code: 'BAD_REQUEST', message: 'Некорректный запрос.' }, 400);
  }

  const honeypot = String(body.company ?? '').trim();
  if (honeypot) return json({ ok: true });

  const name = String(body.name ?? '').trim();
  const phone = String(body.phone ?? '').trim();
  const email = String(body.email ?? '').trim();
  const topic = String(body.topic ?? '').trim();
  const message = String(body.message ?? '').trim();

  if (!name || name.length > 100) {
    return json({ ok: false, code: 'INVALID_NAME', message: 'Проверьте имя.' }, 400);
  }
  if (!phone || phone.length > 40) {
    return json({ ok: false, code: 'INVALID_PHONE', message: 'Проверьте телефон.' }, 400);
  }
  if (email && !EMAIL_RE.test(email)) {
    return json({ ok: false, code: 'INVALID_EMAIL', message: 'Проверьте адрес почты.' }, 400);
  }
  if (message.length > 4000) {
    return json({ ok: false, code: 'INVALID_MESSAGE', message: 'Сообщение слишком длинное.' }, 400);
  }

  const topicLabel = TOPIC_LABELS[topic] ?? topic ?? '—';

  const text = [
    'Новая заявка с сайта «Боги красоты»',
    '',
    `Имя: ${name}`,
    `Телефон: ${phone}`,
    email ? `Email: ${email}` : 'Email: не указан',
    `Направление: ${topicLabel}`,
    message ? `Сообщение: ${message}` : 'Сообщение: не указано',
    '',
    `Отправлено: ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}`,
  ].join('\n');

  const to = process.env.LEAD_TO?.trim() || 'bud-bud777@mail.ru';

  if (!isMailConfigured()) {
    console.log('[LEAD] отправка не настроена (нет SMTP_*/LEAD_WEBHOOK_URL). Заявка:', JSON.stringify({ to, name, phone, email, topic: topicLabel, message }));
    return json({ ok: false, code: 'MAIL_NOT_CONFIGURED', message: 'Отправка временно недоступна. Попробуйте позвонить.' }, 501);
  }

  try {
    await sendLead({
      to,
      subject: `Заявка: ${topicLabel}`,
      text,
    });
    return json({ ok: true });
  } catch (err) {
    console.error('[LEAD] ошибка отправки:', err instanceof Error ? err.message : err);
    return json({ ok: false, code: 'SEND_FAILED', message: 'Не удалось отправить заявку. Попробуйте ещё раз.' }, 500);
  }
}