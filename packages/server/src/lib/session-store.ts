/**
 * @fileoverview MongoDB session store
 */

//Imports
import mongoose from 'mongoose';
import {EventEmitter} from 'events';
import {ISession, Session} from '@/models/session';
import {SessionStore} from 'koa-generic-session';

/**
 * MongoDB session store
 */
class MongoSessionStore extends EventEmitter implements SessionStore
{
  constructor()
  {
    super();

    //Proxy Mongoose events
    mongoose.connection.on('open', () => this.emit('connect'));
    mongoose.connection.on('disconnected', () => this.emit('disconnect'));
  }

  async get(sid: string)
  {
    //Query the database
    const res = await Session.findOne({
      sid
    }, {
      data: 1
    });

    return res?.data;
  }

  async set(sid: string, session: any, ttl?: number)
  {
    //Generate the update payload
    const payload = {
      data: session
    } as ISession;

    if (ttl != null)
    {
      payload.expiresAt = new Date(ttl);
    }

    //Update the database
    await Session.findOneAndUpdate({
      sid
    }, payload, {
      upsert: true
    });
  }

  async destroy(sid: string)
  {
    //Update the database
    await Session.findOneAndDelete({
      sid
    });
  }
};

//Export
export default MongoSessionStore;