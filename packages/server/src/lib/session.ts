/**
 * @fileoverview Session type
 */

//Imports
import {IAccount} from '@/server/models/account';

/**
 * Session type
 */
interface Session
{
  /**
   * Account information
   */
  account: {
    /**
     * Actual user account (Doesn't change when a user impersonates another user)
     */
    actual: IAccount;

    /**
     * Effective user account (Changes when a user impersonates another user)
     */
    effective: IAccount;
  }
}

//Export
export default Session;