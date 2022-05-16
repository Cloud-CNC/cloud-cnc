/**
 * @fileoverview OpenAPI Entity Parser
 */

//Imports
import {OpenAPIV3} from 'openapi-types';
import {resolve} from 'path';
import {default as SwaggerParser} from 'swagger-parser';
import {Entity, Field, Operation, Parameter} from './types';
import {joiType, typescriptType} from './utils';

/**
 * Get entities from the OpenAPI schema
 * @returns Entities
 */
export const getEntities = async () =>
{
  //Initialize the parser
  const parser = new SwaggerParser();

  //Load, parse, and validate the OpenAPI specification
  const api = await parser.validate(resolve(__dirname, '..', '..', 'http', 'openapi.yml')) as OpenAPIV3.Document;

  //Initialize entities
  const entities = Object.values(api.tags ?? []).map(tag =>
  ({
    name: tag.name,
    description: tag.description,
    operations: []
  } as Entity));

  //Aggregate entities by tag
  for (const [pathName, pathValue] of Object.entries(api.paths ?? []))
  {
    //Skip null paths
    if (pathValue == null)
    {
      continue;
    }

    //Find the entity
    const entity = entities.find(entity =>
      Object.values(OpenAPIV3.HttpMethods).find(method =>
        pathValue[method]?.tags?.includes(entity.name)
      )
    );

    //Skip null entities
    if (entity == null)
    {
      continue;
    }

    //Aggregate parameters and operations
    const parameters: Parameter[] = [];
    const operations: Operation[] = [];

    for (const [entryName, entryValue] of Object.entries(pathValue))
    {
      switch (entryName)
      {
        //Add parameters
        case 'parameters': {
          //Cast
          const entry = entryValue as OpenAPIV3.ParameterObject[];

          //Map and add
          parameters.push(...entry.map(entry => ({
            name: entry.name,
            description: entry.description
          } as Parameter)));

          break;
        }

        //Add operations
        case OpenAPIV3.HttpMethods.DELETE:
        case OpenAPIV3.HttpMethods.GET:
        case OpenAPIV3.HttpMethods.HEAD:
        case OpenAPIV3.HttpMethods.OPTIONS:
        case OpenAPIV3.HttpMethods.PATCH:
        case OpenAPIV3.HttpMethods.POST:
        case OpenAPIV3.HttpMethods.PUT:
        case OpenAPIV3.HttpMethods.TRACE: {
          //Cast
          const operation = entryValue as OpenAPIV3.OperationObject;
          const operationRecord = entryValue as Record<string, any>;
          const body = operation.requestBody as OpenAPIV3.RequestBodyObject;

          //Ensure the operation ID and summary are provided
          if (operation.operationId == null || operation.summary == null)
          {
            throw new Error('Operation ID and summary must be provided!');
          }

          //Aggregate operation fields
          const fields = Object.values(body?.content ?? {}).flatMap(content =>
          {
            //Cast
            const schema = content.schema as OpenAPIV3.SchemaObject;

            //Ensure the schema type is an object
            if (schema.type != 'object')
            {
              throw new Error('Only object request schema types are supported!');
            }

            return Object.entries(schema.properties ?? []).map(([propertyName, propertyValue]) =>
            {
              //Cast
              const property = propertyValue as OpenAPIV3.SchemaObject;

              return {
                name: propertyName,
                description: property.description,
                joiType: joiType(property),
                typescriptType: typescriptType(property),
                required: schema.required?.includes(propertyName) || false
              } as Field;
            });
          });

          //Generate permissions
          const permissions = operationRecord['x-bifurcate-permissions'] ? [
            `${operation.operationId}:own`,
            `${operation.operationId}:other`
          ] : [
            operation.operationId
          ];

          //Add the operation
          operations.push({
            name: operation.operationId,
            description: operation.summary,
            type: operationRecord['x-operation-type'],
            permissions,
            method: entryName,
            path: pathName,
            parameters,
            fields
          });

          break;
        }
      }
    }

    //Add the operations
    entity.operations.push(...operations);
  }

  return entities;
};