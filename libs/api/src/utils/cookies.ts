import type { CookieSerializeOptions } from 'cookie';
import { parse, serialize } from 'cookie';

export function getCookies(req: Request) {
  const cookieHeader = req.headers.get('Cookie');
  if (!cookieHeader) return {};
  return parse(cookieHeader);
}

export function getCookie(req: Request, name: string) {
  const cookieHeader = req.headers.get('Cookie');
  if (!cookieHeader) return;
  const cookies = parse(cookieHeader);
  return cookies[name];
}

export function setCookie(
  resHeaders: Headers,
  name: string,
  value: string,
  options?: CookieSerializeOptions,
) {
  resHeaders.append('Set-Cookie', serialize(name, value, options));
}
