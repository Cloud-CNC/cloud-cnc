/**
 * @fileoverview App config
 * 
 * There are a few guiding principles for the config:
 * 1. Minimize required fields
 * 2. All variables should default to sane, secure, production-ready values
 * 3. Process/validate variables in this file (As apposed to when the variable is actually used)
 */

//Imports
import 'dotenv/config';
import {existsSync, readFileSync} from 'fs';
import {randomBytes} from 'crypto';
import log from './log';

//Fatally log and crash
const panic = (message: string) =>
{
  //Log
  log.fatal(message);

  //Crash
  process.exit(1);
};

//Read environment variables
const auth = {
  secret: process.env.AUTH_SECRET || ''
};
const debug = process.env.NODE_ENV == 'development';
const http = {
  port: parseInt(process.env.PORT || '', 10) || 80,
  http2: !!process.env.HTTP2,

  tls: !!process.env.TLS_ENABLED,
  certificate: process.env.TLS_CERTIFICATE,
  key: process.env.TLS_KEY
};
const pretty = !!process.env.PRETTY;
const mongoUrl = process.env.MONGO_URL;
const redisUrl = process.env.REDIS_URL;

//Validate the config
const entropy = 64;
if (Buffer.byteLength(auth.secret) < entropy)
{
  //Generate crypto-safe random secret
  auth.secret = randomBytes(entropy).toString();

  //Log
  log.warn('Auth secret was either too short or not provided, generating new secret!');
}

if (http.http2 && !http.tls)
{
  //Panic with message
  panic('Cannot enable HTTP2 without TLS!');
}

if (http.tls && (http.certificate == null || !existsSync(http.certificate)))
{
  //Panic with message
  panic(`Invalid TLS certificate ${http.certificate}!`);
}
else if (http.tls)
{
  //Read certificate
  http.certificate = readFileSync(http.certificate!, 'utf-8');
}

if (http.tls && (http.key == null || !existsSync(http.key)))
{
  //Panic with message
  panic(`Invalid TLS key ${http.key}!`);
}
else if (http.tls)
{
  //Read key
  http.key = readFileSync(http.key!, 'utf-8');
}

if (mongoUrl == null)
{
  //Panic with message
  panic('Missing Mongo URL!');
}

if (redisUrl == null)
{
  //Log
  log.warn('Redis URL wasn\'t provided, running in single instance mode!');
}

//Export
export
{
  auth,
  debug,
  http,
  pretty,
  mongoUrl,
  redisUrl
};