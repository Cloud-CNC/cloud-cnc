/**
 * @fileoverview Password helper
 */

//Imports
import {hash as hashConfig} from '@/lib/config';
import {cpus} from 'os';
import {Options as ArgonOptions, argon2id, hash as argonHash, verify as argonVerify} from 'argon2';
import {GenerateOptions as GeneratePasswordOptions, generate as generatePassword} from 'generate-password';

//Argon2ID options (See https://github.com/ranisalt/node-argon2/wiki/Options)
const argonOptions = {
  type: argon2id,
  hashLength: 64,
  saltLength: 32,
  memoryCost: hashConfig.memory,
  timeCost: hashConfig.iterations,
  parallelism: cpus().length,
  raw: false
} as ArgonOptions & {raw: false};

//Password generation options
const passwordOptions = {
  excludeSimilarCharacters: true,
  length: 24,
  lowercase: true,
  numbers: true,
  strict: true,
  symbols: false,
  uppercase: true
} as GeneratePasswordOptions;

/**
 * Generate a password
 * @returns Password
 */
const generate = () => generatePassword(passwordOptions);

/**
 * Hash the input
 * @param input Input
 * @returns Hash
 */
const hash = async (input: string) => await (await argonHash(input, argonOptions));

/**
 * Verify the plain text against the hashed text
 * @param hashed Hashed text
 * @param plain Plain text
 * @returns Whether or not the plain and hashed text match
 */
const verify = async (hashed: string, plain: string) => await argonVerify(hashed, plain, argonOptions);

//Export
export
{
  generate,
  hash,
  verify
};