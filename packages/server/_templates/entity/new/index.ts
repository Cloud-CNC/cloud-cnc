/**
 * @fileoverview Hygen helpers
 * 
 * @see https://hygen.io/docs/extensibility#hygenjs
 */

//Imports
import {getEntities} from '../../../../api/lib/openapi/index';
import {uniqWith} from 'lodash';

//Export
module.exports = {
  params: async ({args}: {args: Record<string, string>}) =>
  {
    //Get the name
    const name = args.name?.toLowerCase();

    //Get all entities
    const entities = await getEntities();

    //Find the entity
    const entity = entities.find(entity => entity.name.toLowerCase() == name);

    //Ensure the entity was found
    if (entity == null)
    {
      throw new Error(`Failed to find entity with name ${name}!`);
    }

    //Get unique request fields
    const uniqueRequestFields = uniqWith(entity.operations.flatMap(operation => operation.requestFields), (a, b) =>
      a.name == b.name &&
      a.description == b.description &&
      a.joiType == b.joiType &&
      a.typescriptType == b.typescriptType
    );

    return {
      entity,
      uniqueRequestFields
    };
  }
};