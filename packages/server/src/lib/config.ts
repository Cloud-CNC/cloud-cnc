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
const debug = ['development', 'test'].includes(process.env.NODE_ENV || '');
const hash = {
  iterations: parseInt(process.env.HASH_ITERATIONS || '', 10) || 8,
  memory: parseInt(process.env.HASH_MEMORY || '', 10) || (1024 * 128), //128 MiB,
};
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
if (!debug)
{
  if (hash.iterations < 1)
  {
    //Panic with message
    panic(`Invalid hash iterations ${hash.iterations}! (Must be at least 1)`);
  }

  if (hash.memory < 4096)
  {
    //Panic with message
    panic(`Invalid hash memory usage ${hash.memory}! (Must be at least 4096 KiB)`);
  }

  if (http.port < 1 || 65535 < http.port)
  {
    //Panic with message
    panic(`Invalid server port ${http.port}! (Must be in range 1-65535, inclusive)`);
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
}

//Export
export
{
  debug,
  hash,
  http,
  pretty,
  mongoUrl,
  redisUrl
};