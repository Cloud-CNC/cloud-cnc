/**
 * @fileoverview Utilities
 */

//Imports
import {randomBytes} from 'crypto';

/**
 * Generate a random symbol name
 * @param prefix Symbol prefix
 * @returns Symbol name
 */
export const generateRandomSymbol = (prefix: string) =>
{
  //Get random bytes
  const bytes = randomBytes(5);

  //Convert to string
  const str = bytes.toString('hex');
  
  return prefix + str;
};