import * as crypto from 'node:crypto';

function hashToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export { hashToken };
