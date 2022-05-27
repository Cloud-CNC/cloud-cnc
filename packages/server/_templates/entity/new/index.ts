/**
 * @fileoverview Hygen helpers
 * 
 * @see https://hygen.io/docs/extensibility#hygenjs
 */

//Imports
import {getEntities} from '../../../../api/lib/openapi/index';
import {sortBy, uniqWith} from 'lodash';

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

    //Get all fields
    let fields = entity.operations.flatMap(operation => [...operation.requestFields, ...operation.responseFields]);
    fields = sortBy(fields, field => field.name);

    //Get unique fields
    let uniqueFields = uniqWith(fields, (a, b) =>
      a.name == b.name &&
      a.description == b.description &&
      a.joiType == b.joiType &&
      a.typescriptType == b.typescriptType
    );

    //Strip the id field
    uniqueFields = uniqueFields.filter(field => field.name != 'id');

    return {
      entity,
      uniqueFields
    };
  }
};