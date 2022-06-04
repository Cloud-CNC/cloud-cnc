/**
 * @fileoverview OpenAPI Entity Utilities
 */

//Constants
const MAX_DEPTH = 5;

//Imports
import {OpenAPIV3} from 'openapi-types';

/**
 * Translate an OAS3 schema to a Joi type
 * @param schema OAS3 schema
 * @param depth Recursion depth
 * @returns Joi type definition
 */
export const joiType = (schema: OpenAPIV3.SchemaObject, depth = 0): string =>
{
  //Prevent infinite recursion
  if (depth > MAX_DEPTH)
  {
    return '/*TODO: add recursive reference*/';
  }

  let type: string;

  //Translate
  if (schema.oneOf != null)
  {
    //Update the type
    type = `Joi.alternatives().try(${schema.oneOf.map(value => joiType(value as OpenAPIV3.SchemaObject, depth + 1)).join(', ')}).match('one')`;
  }
  else if (schema.anyOf != null)
  {
    //Update the type
    type = `Joi.alternatives().try(${schema.anyOf.map(value => joiType(value as OpenAPIV3.SchemaObject, depth + 1)).join(', ')}).match('any')`;
  }
  else if (schema.allOf != null)
  {
    //Update the type
    type = `Joi.alternatives().try(${schema.allOf.map(value => joiType(value as OpenAPIV3.SchemaObject, depth + 1)).join(', ')}).match('all')`;
  }
  else if (schema.not != null)
  {
    //Update the type
    type = `Joi.any().not(${joiType(schema.not as OpenAPIV3.SchemaObject, depth + 1)})`;
  }
  //Regular types
  else
  {
    switch (schema.type)
    {
      case 'array':
        //Well-defined arrays
        if (schema.items != null)
        {
          //Cast items
          const items = schema.items as OpenAPIV3.SchemaObject;

          //Translate the item type
          const itemType = joiType(items, depth + 1);

          //Update the type
          type = `Joi.array().items(${itemType})`;

          //Add limits
          if (schema.minItems != null && schema.maxItems != null && schema.minItems == schema.maxItems)
          {
            type += `.length(${schema.minItems})`;
          }

          if (schema.minItems != null)
          {
            type += `.min(${schema.minItems})`;
          }

          if (schema.maxItems != null)
          {
            type += `.max(${schema.maxItems})`;
          }

          //Add unique
          if (schema.uniqueItems)
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

      case 'boolean':
        //Update the type
        type = 'Joi.boolean()';

        break;

      case 'integer':
      case 'number':
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

      case 'object':
        //Well-defined objects
        if (schema.properties != null)
        {
          //Cast properties
          const properties = schema.properties as Record<string, OpenAPIV3.SchemaObject>;

          //Translate property types
          const propertyTypes = Object.entries(properties).map(([key, value]) => `${key}: ${joiType(value, depth + 1)}${schema.required?.includes(key) ? '.required()' : '.optional()'}`).join(',\n');

          //Update the type
          type = `Joi.object(${propertyTypes})`;
        }
        //Well-defined map objects
        else if (typeof schema.additionalProperties == 'object')
        {
          //Cast additional properties
          const additionalProperties = schema.additionalProperties as OpenAPIV3.SchemaObject;

          //Translate additional property type
          const additionalPropertyType = joiType(additionalProperties, depth + 1);

          //Update the type
          type = `Joi.object().pattern(${additionalPropertyType})`;
        }
        //Unknown objects
        else
        {
          //Update the type
          type = 'Joi.object()';
        }

        //Add limits
        if (schema.minProperties != null && schema.maxProperties != null && schema.minProperties == schema.maxProperties)
        {
          type += `.length(${schema.minProperties})`;
        }

        if (schema.minProperties != null)
        {
          type += `.min(${schema.minProperties})`;
        }

        if (schema.maxProperties != null)
        {
          type += `.max(${schema.maxProperties})`;
        }

        break;

      case 'string':
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
          type = `Joi.string().meta({
  _mongoose: {
    type: \'ObjectId\',
    ref: null /*TODO: add collection name*/
  }
})`;
        }
        //Regular strings
        else
        {
          //Update the type
          type = 'Joi.string()';

          //Add pattern
          if (schema.pattern != null)
          {
            type += `.pattern(${schema.pattern})`;
          }

          //Add limits
          if (schema.minLength != null && schema.maxLength != null && schema.minLength == schema.maxLength)
          {
            type += `.length(${schema.minLength})`;
          }
          
          if (schema.minLength != null)
          {
            type += `.min(${schema.minLength})`;
          }

          if (schema.maxLength != null)
          {
            type += `.max(${schema.maxLength})`;
          }
        }

        break;

      default:
        console.log(schema);
        throw new Error(`Cannot translate OAS3 type "${schema.type}"!`);
    }
  }

  return type;
};

/**
 * Translate an OAS3 schema to a Typescript type
 * @param schema OAS3 schema
 * @param depth Recursion depth
 * @returns TypeScript type literal
 */
export const typescriptType = (schema: OpenAPIV3.SchemaObject, depth = 0): string =>
{
  //Prevent infinite recursion
  if (depth > MAX_DEPTH)
  {
    return '/*TODO: add recursive reference*/';
  }

  let type: string;

  //Translate
  if (schema.oneOf != null)
  {
    //Update the type
    type = schema.oneOf.map(value => typescriptType(value as OpenAPIV3.SchemaObject, depth + 1)).join(' | ');
  }
  else if (schema.anyOf != null)
  {
    //Update the type
    type = schema.anyOf.map(value => typescriptType(value as OpenAPIV3.SchemaObject, depth + 1)).join(' | ');
  }
  else if (schema.allOf != null)
  {
    //Update the type
    type = schema.allOf.map(value => typescriptType(value as OpenAPIV3.SchemaObject, depth + 1)).join(' & ');
  }
  else if (schema.not != null)
  {
    //Update the type
    type = 'never /*TODO: add restrictions*/';
  }
  //Regular types
  else
  {
    switch (schema.type)
    {
      case 'array':
        //Well-defined arrays
        if (schema.items != null)
        {
          //Cast items
          const items = schema.items as OpenAPIV3.SchemaObject;

          //Translate the item type
          const itemType = typescriptType(items, depth + 1);

          //Update the type
          type = `${itemType}[]`;
        }
        //Unknown arrays
        else
        {
          //Update the type
          type = 'unknown[]';
        }

        break;

      case 'boolean':
        //Update the type
        type = 'boolean';

        break;

      case 'integer':
      case 'number':
        //Update the type
        type = 'number';

        break;

      case 'object':
        //Well-defined objects
        if (schema.properties != null)
        {
          //Cast properties
          const properties = schema.properties as Record<string, OpenAPIV3.SchemaObject>;

          //Translate property types
          const propertyTypes = Object.entries(properties).map(([key, value]) => `${key}${!schema.required?.includes(key) ? '?' : ''}: ${typescriptType(value, depth + 1)}`).join(',\n');

          //Update the type
          type = `{${propertyTypes}}`;
        }
        //Well-defined map objects
        else if (typeof schema.additionalProperties == 'object')
        {
          //Cast additional properties
          const additionalProperties = schema.additionalProperties as OpenAPIV3.SchemaObject;

          //Translate additional property type
          const additionalPropertyType = typescriptType(additionalProperties, depth + 1);

          //Update the type
          type = `Record<string, ${additionalPropertyType}>`;
        }
        //Unknown objects
        else
        {
          //Update the type
          type = 'object';
        }

        break;

      case 'string':
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
        //Object ID
        else if (schema.format == 'object-id')
        {
          //Update the type
          type = 'ObjectId /*TODO: import Mongoose */';
        }
        //Regular strings
        else
        {
          //Update the type
          type = 'string';
        }

        break;

      default:
        console.log(schema);
        throw new Error(`Cannot translate OAS3 type "${schema.type}"!`);
    }
  }

  return type;
};