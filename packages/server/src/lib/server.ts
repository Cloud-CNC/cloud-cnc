/**
 * @fileoverview HTTP server factory
 */

//Imports
import {createSecureServer as createHttp2Server, Http2ServerRequest, Http2ServerResponse} from 'http2';
import {createServer as createHttpServer, IncomingMessage, ServerResponse} from 'http';
import {createServer as createHttpsServer} from 'https';
import {http} from './config';
import {readFile} from 'fs/promises';

//Generic HTTP server listener
type Listener = (req: IncomingMessage | Http2ServerRequest, res: ServerResponse | Http2ServerResponse) => void;

/**
 * Create an HTTP server
 * @param listener App listener
 * @returns HTTP/HTTPS/HTTP2 server
 */
const createServer = async (listener: Listener) =>
{
  //Plain HTTP server
  if (!http.tls)
  {
    return createHttpServer(listener);
  }
  else
  {
    //Read certificate and key
    const certificate = await readFile(http.certificate!);
    const key = await readFile(http.key!);

    //HTTPS server
    if (!http.http2)
    {
      return createHttpsServer({
        cert: certificate,
        key: key,
        minVersion: 'TLSv1.2'
      }, listener);
    }
    //HTTP2 server
    else
    {
      return createHttp2Server({
        allowHTTP1: true,
        cert: certificate,
        key: key,
        minVersion: 'TLSv1.2'
      }, listener);
    }
  }
};

//Export
export default createServer;