/**
 * @fileoverview Joigoose helper
 */

//Imports
import createJoigoose from 'joigoose';
import mongoose from 'mongoose';

//Create the joigoose instance
const joigoose = createJoigoose(mongoose);

//Export
export default joigoose;