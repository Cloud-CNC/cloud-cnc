/**
 * @fileoverview Bootstrap command
 */

//Imports
import Joi from 'joi';
import log from '@/lib/log';
import {IAccount} from '@/models/account';
import {connect, disconnect} from 'mongoose';
import {createAccount} from '@/controllers/account';
import {format as formatTotpSecret, url as generateOtpauthUrl} from '@/lib/totp';
import {generate as generatePassword} from '@/lib/password';
import {generate as generateUsername} from '@/lib/username';
import {mongoUrl} from '@/lib/config';
import {program} from 'commander';
import {toString as renderQRCode} from 'qrcode';

//Option type
type Options = Pick<IAccount, 'username' | 'password' | 'totpEnabled'>;

//Option schema
const schema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().min(12).required(),
  totpEnabled: Joi.boolean().required()
}).rename('totp', 'totpEnabled');

//Fatally log and crash
const panic = (obj: object, message: string) =>
{
  //Log
  log.fatal(obj, message);

  //Crash
  process.exit(1);
};

//Register the command
program
  .command('bootstrap')
  .description('bootstrap the API server by creating the root account and admin role. Environment variables must be configured prior to running this command.')
  .option('-u, --username <username>', 'root account username', generateUsername())
  .option('-p, --password <password>', 'root account password', generatePassword())
  .option('-t, --no-totp', 'disable root account TOTP (Strongly discouraged)', true)
  .action(async (rawOptions: Record<string, any>) =>
  {
    //Validate the options
    const res = schema.validate(rawOptions);

    //Invalid options
    if (res.error != null || res.warning != null)
    {
      //Panic with message
      panic(res, 'Invalid options!');
    }

    //Get options
    const options = res.value as Options;

    //Connect to Mongo
    await connect(mongoUrl!);

    //TODO: Create the admin role

    //Create the root account
    const account = await createAccount({
      ...options,
      roles: [
        'admin'
      ]
    });

    //Disconnect from Mongo
    await disconnect();

    //Display the TOTP QR code
    if (options.totpEnabled)
    {
      //Generate the otpauth URL
      const url = generateOtpauthUrl(options.username, account.totpSecret!);

      //Render the QR code
      const qrcode = await renderQRCode(url, {
        type: 'terminal'
      });

      //Format the TOTP secret (Easier for us humans to type)
      const secret = formatTotpSecret(account.totpSecret!);

      //Log
      log.info('\n' + qrcode);
      log.info(`Scan the above QR code with your MFA app (Or manually enter ${secret} for the secret)`);
    }

    //Log
    log.info(`Created root account with (Username: ${options.username}, password: ${options.password})`);
  });