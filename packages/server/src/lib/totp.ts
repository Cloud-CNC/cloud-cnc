/**
 * @fileoverview Time-based One-Time Password (TOTP) helper
 */

//Imports
import {authenticator} from 'otplib';
import {chunk} from 'lodash-es';

/**
 * Format a TOTP secret
 * @param secret TOTP secret
 * @returns Formatted secret
 */
export const format = (secret: string) => chunk(secret.split(''), 6).map(characters => characters.join('')).join(' ');

/**
 * Generate a Google Authenticator compatible TOTP secret
 * @returns TOTP secret
 */
export const generate = () => authenticator.generateSecret(32);

/**
 * Generate an `otpauth` URL
 * @param username Account username
 * @param secret Account TOTP secret
 * @returns URL
 */
export const url = (username: string, secret: string) => authenticator.keyuri(username, 'Cloud CNC', secret);

/**
 * Verify a Google Authenticate compatible TOTP
 * @param token TOTP
 * @param secret TOTP secret
 * @returns Whether or not the token is valid
 */
export const verify = (token: string, secret: string) => authenticator.check(token, secret);