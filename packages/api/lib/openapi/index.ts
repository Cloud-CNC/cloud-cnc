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
  for (const [pathKey, pathValue] of Object.entries(api.paths ?? []))
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

    for (const [entryKey, entryValue] of Object.entries(pathValue))
    {
      switch (entryKey)
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
          const requestBody = operation.requestBody as OpenAPIV3.RequestBodyObject;

          //Ensure the operation ID and summary are provided
          if (operation.operationId == null || operation.summary == null)
          {
            throw new Error('Operation ID and summary must be provided!');
          }

          //Aggregate operation fields
          const requestFields: Field[] = [];

          if (requestBody != null && requestBody.content != null)
          {
            for (const content of Object.values(requestBody.content))
            {
              //Cast
              let schema = content.schema as OpenAPIV3.SchemaObject;

              //Skip empty schemas
              if (schema == null)
              {
                continue;
              }

              //Resolve arrays
              if (schema.type == 'array')
              {
                schema = schema.items as OpenAPIV3.SchemaObject;
              }

              //Skip non-object-schema or property-less contents
              if (schema.type != 'object' || schema.properties == null)
              {
                continue;
              }

              //Convert properties
              const properties = Object.entries(schema.properties).map(([propertyKey, propertyValue]) =>
              {
                //Cast
                const property = propertyValue as OpenAPIV3.SchemaObject;

                return {
                  name: propertyKey,
                  description: property.description,
                  joiType: joiType(property),
                  typescriptType: typescriptType(property),
                  required: schema.required?.includes(propertyKey) || false
                } as Field;
              });

              //Add
              requestFields.push(...properties);
            }
          }

          const responseFields: Field[] = [];

          for (const [responseKey, responseValue] of Object.entries(operation.responses))
          {
            //Cast
            const response = responseValue as OpenAPIV3.ResponseObject;

            //Parse the status code
            const statusCode = parseInt(responseKey);

            //Skip non-200 or content-less responses
            if ((statusCode < 200 || 300 <= statusCode) || response.content == null)
            {
              continue;
            }

            for (const [contentKey, contentValue] of Object.entries(response.content))
            {
              //Cast
              let schema = contentValue.schema as OpenAPIV3.SchemaObject;

              //Skip empty schemas
              if (schema == null)
              {
                continue;
              }

              //Resolve arrays
              if (schema.type == 'array')
              {
                schema = schema.items as OpenAPIV3.SchemaObject;
              }

              //Skip non-JSON, non-object-schema, or property-less contents
              if (contentKey != 'application/json' || schema.type != 'object' || schema.properties == null)
              {
                continue;
              }

              //Convert properties
              const properties = Object.entries(schema.properties).map(([propertyKey, propertyValue]) =>
              {
                //Cast
                const property = propertyValue as OpenAPIV3.SchemaObject;

                return {
                  name: propertyKey,
                  description: property.description,
                  joiType: joiType(property),
                  typescriptType: typescriptType(property),
                  required: schema.required?.includes(propertyKey) || false
                } as Field;
              });

              //Add
              responseFields.push(...properties);
            }
          }

          //Convert path parameter format
          const path = pathKey.replace(/\{(.+)\}/, ':$1');

          //Add the operation
          operations.push({
            name: operation.operationId,
            description: operation.summary,
            permission: operation.operationId,
            type: operationRecord['x-operation-type'],
            method: entryKey,
            path,
            parameters,
            requestFields,
            responseFields
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