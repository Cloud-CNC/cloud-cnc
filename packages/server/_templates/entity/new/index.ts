/**
 * @fileoverview Hygen helpers
 * 
 * @see https://hygen.io/docs/extensibility#hygenjs
 */

//Imports
import {getEntities} from '../../../../api/lib/openapi/index';
import {isEqual, uniqWith} from 'lodash';

//Export
module.exports = {
  params: async ({args}: {args: Record<string, string>}) =>
  {
    //Get the entity name
    const entityName = args.entity?.toLowerCase();

    //Get all entities
    const entities = await getEntities();

    //Find the entity
    const entity = entities.find(entity => entity.name.toLowerCase() == entityName);

    //Ensure the entity was found
    if (entity == null)
    {
      throw new Error(`Failed to find entity with name ${entityName}!`);
    }

    //Get unique fields
    const fields = uniqWith(entity.operations.flatMap(operation => operation.fields), (a, b) =>
      a.name == b.name &&
      a.description == b.description &&
      a.joiType == b.joiType &&
      a.typescriptType == b.typescriptType
    );

    //Get unique parameters
    const parameters = uniqWith(entity.operations.flatMap(operation => operation.parameters), (a, b) =>
      a.name == b.name &&
      a.description == b.description
    );

    return {
      entity,
      fields,
      parameters
    };
  }
};