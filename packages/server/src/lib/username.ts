/**
 * @fileoverview Username helper
 */

//Imports
import {generate as generateUsername} from 'canihazusername';

/**
 * Username template
 * Should yield ~7,318,800 permutations
 */
const usernameTemplate = '{size}-{colors}-{3d_printing|astronomy|geometry|physics}';

/**
 * Generate a username
 * @returns Username
 */
const generate = () => generateUsername(usernameTemplate);

//Export
export
{
  generate
};