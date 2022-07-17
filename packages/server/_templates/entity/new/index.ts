/**
 * @fileoverview Hygen helpers
 * 
 * @see https://hygen.io/docs/extensibility#hygenjs
 */

//Imports
import getEntities from '../../../../api/lib/openapi';
import {OperationSchema, OperationSchemaType, OperationType} from '../../../../api/lib/openapi/types';
import {isEqual, omit, orderBy, uniqWith} from 'lodash-es';
import {pluralize} from 'inflection';

/**
 * Format a list with separators
 * @param list List to format
 * @param normalSeparator Normal item separator
 * @param lastSeparator Last item separator
 * @returns Formatted list for use in a for-of loop
 */
const list = (list: any[], normalSeparator: string, lastSeparator = '') => list.map((item, index) => [item, (index < list.length - 1) ? normalSeparator : lastSeparator]);

/**
 * Format raw text as a multiline comment
 * @returns Multiline comment
 */
const multiline = (raw: string, indent: number) => raw.trim().split(/[\r\n]{1,2}/).map(line => `${' '.repeat(indent)}* ${line}`).join('\n');

/**
 * Translate an operation schema to a Joi type
 * @param schema Operation schema
 * @param metadata Whether or not to include Mongoose metadata
 * @returns Joi type definition
 */
const joiType = (schema: OperationSchema, metadata = false): string =>
{
  //Translate
  let type: string;

  //Complex types
  if (schema.oneOf != null)
  {
    //Update the type
    type = `Joi.alternatives().try(${schema.oneOf.map(subSchema => joiType(subSchema, metadata)).join(', ')}).match('one')`;
  }
  else if (schema.anyOf != null)
  {
    //Update the type
    type = `Joi.alternatives().try(${schema.anyOf.map(subSchema => joiType(subSchema, metadata)).join(', ')}).match('any')`;
  }
  else if (schema.allOf != null)
  {
    //Update the type
    type = `Joi.alternatives().try(${schema.allOf.map(subSchema => joiType(subSchema, metadata)).join(', ')}).match('all')`;
  }
  else if (schema.not != null)
  {
    //Update the type
    type = `Joi.any().not(${joiType(schema.not, metadata)})`;
  }
  //Regular types
  else
  {
    switch (schema.type)
    {
      case OperationSchemaType.ARRAY:
        //Well-defined arrays
        if (schema.subSchema != null)
        {
          //Update the type
          type = `Joi.array().items(${joiType(schema.subSchema, metadata)})`;

          //Add limits
          if (schema.minimum != null && schema.maximum != null && schema.minimum == schema.maximum)
          {
            type += `.length(${schema.minimum})`;
          }

          if (schema.minimum != null)
          {
            type += `.min(${schema.minimum})`;
          }

          if (schema.maximum != null)
          {
            type += `.max(${schema.maximum})`;
          }

          //Add unique
          if (schema.unique)
          {
            type += '.unique()';
          }
        }
        //Unknown arrays
        else
        {
          //Update the type
          type = 'Joi.array()';
        }

        break;

      case OperationSchemaType.BOOLEAN:
        //Update the type
        type = 'Joi.boolean()';

        break;

      case OperationSchemaType.INTEGER:
      case OperationSchemaType.NUMBER:
        //Update the type
        type = 'Joi.number()';

        //Add limits
        if (schema.minimum != null)
        {
          type += schema.exclusiveMinimum ? `.greater(${schema.minimum})` : `.min(${schema.minimum})`;
        }

        if (schema.maximum != null)
        {
          type += schema.exclusiveMaximum ? `.less(${schema.maximum})` : `.max(${schema.maximum})`;
        }

        break;

      case OperationSchemaType.OBJECT:
        //Well-defined objects
        if (schema.subSchemas != null)
        {
          //Translate property types
          const propertyTypes =
            schema.subSchemas
              .map(subSchema => `${subSchema.key}: ${joiType(subSchema, metadata)}${subSchema.required ? '.required()' : '.optional()'}`)
              .join(',\n');

          //Update the type
          type = `Joi.object(${propertyTypes})`;
        }
        //Well-defined map objects
        else if (schema.subSchema != null)
        {
          //Update the type
          type = `Joi.object().pattern(${joiType(schema.subSchema, metadata)})`;
        }
        //Unknown objects
        else
        {
          //Update the type
          type = 'Joi.object()';
        }

        //Add limits
        if (schema.minimum != null && schema.maximum != null && schema.minimum == schema.maximum)
        {
          type += `.length(${schema.minimum})`;
        }

        if (schema.minimum != null)
        {
          type += `.min(${schema.minimum})`;
        }

        if (schema.maximum != null)
        {
          type += `.max(${schema.maximum})`;
        }

        break;

      case OperationSchemaType.STRING:
        //Enums
        if (schema.enum != null)
        {
          //Update the type
          type = `Joi.string().valid(${schema.enum.map(value => `'${value}'`).join(', ')})`;
        }
        //Dates
        else if (schema.format == 'date' || schema.format == 'date-time')
        {
          //Update the type
          type = 'Joi.date()';
        }
        //Binary
        else if (schema.format == 'binary')
        {
          //Update the type
          type = 'Joi.binary()';
        }
        //Object ID
        else if (schema.format == 'object-id')
        {
          //Update the type
          type = 'Joi.string()';

          //Add metadata
          if (metadata)
          {
            type += `.meta({
    _mongoose: {${schema.searchable != null ? `
      searchable: ${schema.searchable},` : ''}
      type: 'ObjectId',
      ref: null //TODO: add collection name
    }
  })`;
          }
        }
        //Regular strings
        else
        {
          //Update the type
          type = 'Joi.string()';

          //Add pattern
          if (schema.pattern != null)
          {
            type += `.pattern(/${schema.pattern}/)`;
          }

          //Add limits
          if (schema.minimum != null && schema.maximum != null && schema.minimum == schema.maximum)
          {
            type += `.length(${schema.minimum})`;
          }

          if (schema.minimum != null)
          {
            type += `.min(${schema.minimum})`;
          }

          if (schema.maximum != null)
          {
            type += `.max(${schema.maximum})`;
          }
        }

        //Add searchable
        if (metadata && schema.format != 'object-id' && schema.searchable != null)
        {
          type += `.meta({
    _mongoose: {
      searchable: ${schema.searchable}
    }
  })`;
        }

        break;

      default:
        throw new Error(`Cannot translate operation schema type ${schema.type}!`);
    }
  }

  return type;
};

/**
 * Translate an operation schema to a TypeScript type
 * @param schema Operation schema
 * @returns TypeScript type literal
 */
const typescriptType = (schema: OperationSchema): string =>
{
  //Translate
  let type: string;

  //Complex types
  if (schema.oneOf != null)
  {
    //Update the type
    type = schema.oneOf.map(subSchema => typescriptType(subSchema)).join(' | ');
  }
  else if (schema.anyOf != null)
  {
    //Update the type
    type = schema.anyOf.map(subSchema => typescriptType(subSchema)).join(' | ');
  }
  else if (schema.allOf != null)
  {
    //Update the type
    type = schema.allOf.map(subSchema => typescriptType(subSchema)).join(' & ');
  }
  else if (schema.not != null)
  {
    //Update the type
    type = 'never //TODO: add restrictions';
  }
  //Regular types
  else
  {
    switch (schema.type)
    {
      case OperationSchemaType.ARRAY:
        //Well-defined arrays
        if (schema.subSchema != null)
        {
          //Update the type
          type = `${typescriptType(schema.subSchema)}[]`;
        }
        //Unknown arrays
        else
        {
          //Update the type
          type = 'unknown[]';
        }

        break;

      case OperationSchemaType.BOOLEAN:
        //Update the type
        type = 'boolean';

        break;

      case OperationSchemaType.INTEGER:
      case OperationSchemaType.NUMBER:
        //Update the type
        type = 'number';

        break;

      case OperationSchemaType.OBJECT:
        //Well-defined objects
        if (schema.subSchemas != null)
        {
          //Translate property types
          const propertyTypes = schema.subSchemas
            .map(subSchema => `${subSchema.key}${subSchema.required ? '?' : ''}: ${typescriptType(subSchema)}`)
            .join(',\n');

          //Update the type
          type = `{${propertyTypes}}`;
        }
        //Well-defined map objects
        else if (schema.subSchema != null)
        {
          //Update the type
          type = `Record<string, ${typescriptType(schema.subSchema)}>`;
        }
        //Unknown objects
        else
        {
          //Update the type
          type = 'object';
        }

        break;

      case OperationSchemaType.STRING:
        //Enums
        if (schema.enum != null)
        {
          //Update the type
          type = schema.enum.map(value => `'${value}'`).join(' | ');
        }
        //Dates
        else if (schema.format == 'date' || schema.format == 'date-time')
        {
          //Update the type
          type = 'Date';
        }
        //Binary
        else if (schema.format == 'binary')
        {
          //Update the type
          type = 'Buffer';
        }
        //Regular strings
        else
        {
          //Update the type
          type = 'string';
        }

        break;

      default:
        throw new Error(`Cannot translate operation schema type ${schema.type}!`);
    }
  }

  return type;
};

//Export
module.exports = {
  params: async ({args, h: helpers}: {args: Record<string, string>, h: Record<string, any>}) =>
  {
    //Register helpers
    helpers.list = list;
    helpers.multiline = multiline;
    helpers.joiType = joiType;
    helpers.typescriptType = typescriptType;

    //Get the name
    const name = pluralize(args.name?.toLowerCase() ?? '');

    //Get all entities
    const entities = await getEntities();

    //Find the entity
    const entity = entities.find(entity => entity.name.toLowerCase() == name);

    //Ensure the entity was found
    if (entity == null)
    {
      throw new Error(`Failed to find entity with name ${name}!`);
    }

    //Get all schemas
    const rawSchemas = entity.operations
      .filter(operation => operation.type != null)
      .flatMap(operation =>
      {
        //Aggregate operation schemas
        const schemas = [];

        switch (operation.type)
        {
          case OperationType.ALL: {
            //Get the relevant response sub-schema
            const subSchema = operation.responseSchema?.subSchemas?.find(subSchema => subSchema.key == name);

            //Add the response sub-schema
            if (subSchema?.subSchema?.subSchemas != null)
            {
              schemas.push(...subSchema.subSchema.subSchemas);
            }

            break;
          }

          default: {
            //Add request schema
            if (operation.requestSchema?.subSchemas != null)
            {
              schemas.push(...operation.requestSchema.subSchemas);
            }

            //Add response schema
            if (operation.responseSchema?.subSchemas != null)
            {
              schemas.push(...operation.responseSchema.subSchemas);
            }
            break;
          }
        }

        return schemas;
      });

    //Sort schemas
    const sortedSchemas = orderBy(rawSchemas, ['description', 'key', 'required'], ['asc', 'asc', 'desc']);

    //Get unique schemas
    const omitted = ['required'] as (keyof OperationSchema)[];
    const uniqueSchemas = uniqWith(sortedSchemas, (a, b) => isEqual(omit(a, omitted), omit(b, omitted)));

    //Filter out ID schemas
    const schemas = uniqueSchemas.filter(schema => schema?.key != 'id');

    return {
      entity,
      schemas
    };
  }
};