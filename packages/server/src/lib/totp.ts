/**
 * @fileoverview Time-based One-Time Password (TOTP) helper
 */

//Imports
import {authenticator} from 'otplib';

/**
 * Generate a Google Authenticator compatible TOTP secret
 * @returns TOTP secret
 */
const generate = () => authenticator.generateSecret(64);

/**
 * Verify a Google Authenticate compatible TOTP
 * @param token TOTP
 * @param secret TOTP secret
 * @returns 
 */
const verify = (token: string, secret: string) => authenticator.check(token, secret);

//Export
export {
  generate,
  verify
}