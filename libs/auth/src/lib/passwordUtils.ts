import * as crypto from 'node:crypto';

import * as bcrypt from 'bcryptjs';

/**
 * Hashes a token using the SHA256 algorithm.
 *
 * @param {string} token The token to be hashed.
 * @returns {string} The hashed token.
 */
function hashToken({ token }: { token: string }): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Hashes a password using bcrypt.
 *
 * @param password The password to be hashed.
 * @param hash The number of rounds to use for hashing (default: 12).
 * @returns {string} The hashed password.
 */
function hashPassword({
  password,
  hash = 12,
}: {
  password: string;
  hash?: number;
}): string {
  return bcrypt.hashSync(password, hash);
}

/**
 * Compares a hashed password with a plain text password.
 *
 * @param hashedPassword The hashed password to compare.
 * @param password The plain text password to compare.
 * @returns {boolean} True if the passwords match, false otherwise.
 */
function comparePasswords({
  hashedPassword,
  password,
}: {
  hashedPassword: string;
  password: string;
}): boolean {
  return bcrypt.compareSync(hashedPassword, password);
}

export { comparePasswords, hashPassword, hashToken };
