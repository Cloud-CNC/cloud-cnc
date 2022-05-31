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
import log from './log';
import {existsSync, readFileSync} from 'fs';

//Fatally log and crash
const panic = (message: string) =>
{
  //Log
  log.fatal(message);

  //Crash
  process.exit(1);
};

//App modes
export enum Mode
{
  DEVELOPMENT = 'development',
  TESTING = 'testing',
  PRODUCTION = 'production'
}

//Read environment variables
let mode: Mode;
switch (process.env.NODE_ENV)
{
  case 'development':
    mode = Mode.DEVELOPMENT;
    break;

  case 'test':
    mode = Mode.TESTING;
    break;

  default:
    mode = Mode.PRODUCTION;
    break;
}

const hash = {
  iterations: parseInt(process.env.HASH_ITERATIONS || '', 10) || 8,
  memory: parseInt(process.env.HASH_MEMORY || '', 10) || (1024 * 128), //128 MiB
};

const http = {
  port: parseInt(process.env.PORT || '', 10) || 80,
  http2: process.env.HTTP2 == 'true',

  tls: process.env.TLS_ENABLED == 'true',
  certificate: undefined as Buffer | undefined,
  key: undefined as Buffer | undefined
};

const mongoUrl = process.env.MONGO_URL;
const redisUrl = process.env.REDIS_URL;

//Validate the config
if (mode == Mode.TESTING)
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

  if (http.tls && process.env.TLS_CERTIFICATE == null || process.env.TLS_KEY == null)
  {
    //Override TLS
    http.tls = false;

    //Log
    log.warn('The TLS certificate and/or key weren\'t provided, disabling TLS!');
  }

  if (http.tls && process.env.TLS_CERTIFICATE != null)
  {
    if (!existsSync(process.env.TLS_CERTIFICATE))
    {
      //Panic with message
      panic(`Invalid TLS certificate ${process.env.TLS_CERTIFICATE}!`);
    }
    else
    {
      //Read certificate
      http.certificate = readFileSync(process.env.TLS_CERTIFICATE);
    }
  }

  if (http.tls && process.env.TLS_KEY != null)
  {
    if (!existsSync(process.env.TLS_KEY))
    {
      //Panic with message
      panic(`Invalid TLS key ${process.env.TLS_KEY}!`);
    }
    else
    {
      //Read key
      http.key = readFileSync(process.env.TLS_KEY);
    }
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
  mode,
  hash,
  http,
  mongoUrl,
  redisUrl
};