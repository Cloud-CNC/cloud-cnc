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
import {existsSync} from 'fs';
import {LevelWithSilent, levels} from 'pino';

//Fatally log and crash
const panic = (message: string) =>
{
  //Log
  console.error(message);

  //Crash
  process.exit(1);
};

/**
 * App modes
 */
export enum Mode
{
  /**
   * Development environment
   */
  DEVELOPMENT = 'development',

  /**
   * Testing environment (Often in a CI/CD pipeline)
   */
  TESTING = 'testing',

  /**
   * Production environment
   */
  PRODUCTION = 'production'
}

//Read environment variables

/**
 * Current app mode
 */
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

/**
 * Logging configuration
 */
const log = {
  /**
   * Whether or not pretty logging is enabled
   */
  pretty: process.env.PRETTY == 'true',

  /**
   * Minimum logging level
   */
  level: process.env.LOG_LEVEL as LevelWithSilent
};

if (log.level == null)
{
  switch (mode)
  {
    case Mode.DEVELOPMENT:
      log.level = 'debug';
      break;

    case Mode.PRODUCTION:
      log.level = 'info';
      break;

    case Mode.TESTING:
      log.level = 'warn';
      break;
  }
}

/**
 * Argon2ID hashing options
 * 
 * @see https://datatracker.ietf.org/doc/html/draft-irtf-cfrg-argon2-11#section-4
 */
const hash = {
  /**
   * Iterations
   * @default `8`
   */
  iterations: parseInt(process.env.HASH_ITERATIONS ?? '', 10) || 8,

  /**
   * Memory in KiB
   * @default `128 MiB`
   */
  memory: parseInt(process.env.HASH_MEMORY ?? '', 10) || (1024 * 128), //128 MiB
};

/**
 * HTTP server options
 */
const http = {
  /**
   * Server port
   * @default `80`
   */
  port: parseInt(process.env.PORT ?? '', 10) || 80,

  /**
   * Whether or not to enable HTTP2
   * @default `false`
   */
  http2: process.env.HTTP2 == 'true',

  /**
   * Whether or not TLS is enabled
   * @default `false`
   */
  tls: process.env.TLS_ENABLED == 'true',
  
  /**
   * TLS certificate path
   */
  certificate: process.env.TLS_CERTIFICATE ?? '',

  /**
   * TLS key path
   */
  key: process.env.TLS_KEY ?? ''
};

/**
 * Fully-qualified MongoDB URL including database name
 * 
 * **Note: use `127.0.0.1` if `localhost` causes errors!**
 */
const mongoUrl = process.env.MONGO_URL ?? '';

/**
 * Fully-qualified Redis URL
 */
const redisUrl = process.env.REDIS_URL ?? '';

//Validate the config
if (mode != Mode.TESTING)
{
  if (!Object.keys(levels.values).includes(log.level))
  {
    //Panic with message
    panic(`Log level ${log.level} is invalid! (Must be one of ${Object.keys(levels.values).join(', ')})`);
  }

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

  if (http.tls && (http.certificate == '' || http.key == ''))
  {
    //Panic with message
    panic('The TLS certificate and/or key weren\'t provided, disabling TLS!');
  }

  if (http.tls && http.certificate != '')
  {
    if (!existsSync(http.certificate))
    {
      //Panic with message
      panic(`Invalid TLS certificate ${http.certificate}!`);
    }
  }

  if (http.tls && http.key != '')
  {
    if (!existsSync(http.key))
    {
      //Panic with message
      panic(`Invalid TLS key ${http.key}!`);
    }
  }

  if (mongoUrl == '')
  {
    //Panic with message
    panic('Missing Mongo URL!');
  }

  if (redisUrl == '')
  {
    //Log
    console.warn('Redis URL wasn\'t provided, running in single instance mode!');
  }
}

//Export
export
{
  mode,
  log,
  hash,
  http,
  mongoUrl,
  redisUrl
};