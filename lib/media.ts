import fs from 'fs';
import path from 'path';

export function hasPublicFile(src?: string | null): boolean {
  if (!src) return false;
  try {
    return fs.existsSync(path.join(process.cwd(), 'public', src));
  } catch {
    return false;
  }
}