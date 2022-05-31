/**
 * @fileoverview Password helper
 */

//Imports
import {hash as hashConfig} from '@/lib/config';
import {cpus} from 'os';
import {argon2id, hash as argonHash, verify as argonVerify, Options} from 'argon2';

//Argon2ID options (See https://github.com/ranisalt/node-argon2/wiki/Options)
const argonOptions = {
  type: argon2id,
  hashLength: 64,
  saltLength: 32,
  memoryCost: hashConfig.memory,
  timeCost: hashConfig.iterations,
  parallelism: cpus().length,
  raw: false
} as Options & {raw: false};

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
  hash,
  verify
};