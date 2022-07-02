/**
 * @fileoverview OpenAPI Entity Utilities
 */

//Constants
const MAX_DEPTH = 5;

//Imports
import {OpenAPIV3} from 'openapi-types';
import {OperationSchema, OperationSchemaType} from './types';
import {check as rawCheckRegex} from 'recheck';
import {inspect} from 'util';
import {memoize} from 'lodash-es';

//Memoize ReDoS checker
const checkRegex = memoize(rawCheckRegex);

/**
 * Translate an OAS3 schema to an operation schema
 * @param input OAS3 schema
 */
const translateSchema = async (input: OpenAPIV3.SchemaObject, depth = 0): Promise<OperationSchema<any, boolean>> =>
{
  //Translate
  const output = {
    description: input.description
  } as OperationSchema;

  //Prevent infinite recursion
  if (depth > MAX_DEPTH)
  {
    //Update the schema
    output.description += '//TODO: add recursive reference';
  }
  //Complex types
  else if (input.oneOf != null)
  {
    //Cast oneOf
    const oneOf = input.oneOf as OpenAPIV3.SchemaObject[];

    //Generate sub-schemas
    const subSchemas: OperationSchema[] = [];
    for (const value of oneOf)
    {
      //Translate the sub-schema
      const subSchema = await translateSchema(value, depth + 1);

      //Add the sub-schema
      subSchemas.push(subSchema);
    }

    //Update the schema
    output.oneOf = subSchemas;
  }
  else if (input.anyOf != null)
  {
    //Cast anyOf
    const anyOf = input.anyOf as OpenAPIV3.SchemaObject[];

    //Generate sub-schemas
    const subSchemas: OperationSchema[] = [];
    for (const value of anyOf)
    {
      //Translate the sub-schema
      const subSchema = await translateSchema(value, depth + 1);

      //Add the sub-schema
      subSchemas.push(subSchema);
    }

    //Update the schema
    output.anyOf = subSchemas;
  }
  else if (input.allOf != null)
  {
    //Cast allOf
    const allOf = input.allOf as OpenAPIV3.SchemaObject[];

    //Generate sub-schemas
    const subSchemas: OperationSchema[] = [];
    for (const value of allOf)
    {
      //Translate the sub-schema
      const subSchema = await translateSchema(value, depth + 1);

      //Add the sub-schema
      subSchemas.push(subSchema);
    }

    //Update the schema
    output.allOf = subSchemas;
  }
  else if (input.not != null)
  {
    //Translate the sub-schema
    const subSchema = await translateSchema(input.not as OpenAPIV3.SchemaObject, depth + 1);

    //Update the schema
    output.not = subSchema;
  }
  //Regular types
  else
  {
    switch (input.type)
    {
      case 'array':
        //Update the schema
        output.type = OperationSchemaType.ARRAY;
        output.unique = false;

        //Well-defined arrays
        if (input.items != null)
        {
          //Cast items
          const items = input.items as OpenAPIV3.SchemaObject;

          //Translate sub-schema
          output.subSchema = await translateSchema(items, depth + 1);

          //Add limits
          if (input.minItems != null)
          {
            output.minimum = input.minItems;
          }

          if (input.maxItems != null)
          {
            output.maximum = input.maxItems;
          }

          //Add unique
          if (input.uniqueItems)
          {
            output.unique = input.uniqueItems;
          }
        }

        break;

      case 'boolean':
        //Update the schema
        output.type = OperationSchemaType.BOOLEAN;

        break;

      case 'integer':
      case 'number':
        //Update the schema
        output.type = input.type;
        output.exclusiveMinimum = false;
        output.exclusiveMaximum = false;

        //Add limits
        if (input.minimum != null)
        {
          output.minimum = input.minimum;
        }

        if (input.maximum != null)
        {
          output.maximum = input.maximum;
        }

        //Add exclusivity
        if (input.exclusiveMinimum != null)
        {
          output.exclusiveMinimum = input.exclusiveMinimum;
        }

        if (input.exclusiveMaximum != null)
        {
          output.exclusiveMaximum = input.exclusiveMaximum;
        }

        break;

      case 'object':
        //Update the schema
        output.type = OperationSchemaType.OBJECT;
        output.exclusiveMinimum = true;
        output.exclusiveMaximum = true;

        //Well-defined objects
        if (input.properties != null)
        {
          //Cast properties
          const properties = input.properties as Record<string, OpenAPIV3.SchemaObject>;

          //Generate sub-schemas
          const subSchemas: OperationSchema[] = [];
          for (const [key, value] of Object.entries(properties))
          {
            //Translate the sub-schema
            const subSchema = await translateSchema(value, depth + 1);

            //Update the sub-schema
            subSchema.key = key;
            subSchema.required = input.required?.includes(key) ?? false;

            //Add the sub-schema
            subSchemas.push(subSchema);
          }

          //Update the schema
          output.subSchemas = subSchemas;
        }
        //Well-defined map objects
        else if (typeof input.additionalProperties == 'object')
        {
          //Cast additional properties
          const additionalProperties = input.additionalProperties as OpenAPIV3.SchemaObject;

          //Translate the sub-schema
          const subSchema = await translateSchema(additionalProperties, depth + 1);

          //Update the schema
          output.subSchema = subSchema;
        }

        //Add limits
        if (input.minProperties != null)
        {
          output.minimum = input.minProperties;
        }

        if (input.maxProperties != null)
        {
          output.maximum = input.maxProperties;
        }

        break;

      case 'string':
        //Update the schema
        output.type = OperationSchemaType.STRING;
        output.searchable = (input as Record<string, any>)['x-searchable'] ?? false;

        //Enums
        if (input.enum != null)
        {
          //Update the schema
          output.enum = input.enum;
        }
        //Regular strings
        else
        {
          //Add format
          if (input.format != null)
          {
            output.format = input.format;
          }

          //Add pattern
          if (input.pattern != null)
          {
            //Ensure the pattern is vulnerable to ReDoS
            const diagnostics = await checkRegex(input.pattern, '');

            if (diagnostics.status != 'safe')
            {
              throw new Error(`Potentially ReDoS vulnerable pattern ${input.pattern}!`);
            }

            output.pattern = input.pattern;
          }

          //Add limits
          if (input.minLength != null)
          {
            output.minimum = input.minLength;
          }

          if (input.maxLength != null)
          {
            output.maximum = input.maxLength;
          }
        }

        break;

      default:
        throw new Error(`Cannot translate OAS3 type ${inspect(input)}!`);
    }
  }

  return output;
};

//Export
export default translateSchema;