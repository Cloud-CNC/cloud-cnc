//Imports
import {IAccount} from '@/models/account';
import generateQuery from '.';

const main = async () =>
{
  //Generate the query
  const query = generateQuery<IAccount>('(admin-1 OR NOT \'admin a2\') AND admin-3', [
    'username'
  ]);

  console.log(JSON.stringify(query));
};

main();