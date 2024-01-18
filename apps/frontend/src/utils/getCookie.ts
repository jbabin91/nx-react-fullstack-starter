export function getCookie(name: string): string | null {
  const nameLenPlus = name.length + 1;
  return (
    document.cookie
      .split(';')
      .map((cookie) => cookie.trim())
      .filter(
        (cookie) => cookie.slice(0, Math.max(0, nameLenPlus)) === `${name}=`,
      )
      .map((cookie) =>
        decodeURIComponent(cookie.slice(Math.max(0, nameLenPlus))),
      )[0] || null
  );
}
