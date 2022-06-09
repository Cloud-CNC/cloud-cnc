/**
 * @fileoverview OpenAPI Entity Parser
 */

//Imports
import {Entity, EntityOperation, OperationParameter, OperationSchema} from './types';
import {OpenAPIV3} from 'openapi-types';
import {default as SwaggerParser} from 'swagger-parser';
import translateSchema from './utils';
import {resolve} from 'path';

/**
 * Get entities from the OpenAPI schema
 * @returns Entities
 */
const getEntities = async () =>
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
    const pathParameters: OperationParameter[] = [];
    const queryParameters: OperationParameter[] = [];
    const operations: EntityOperation[] = [];

    for (const [entryKey, entryValue] of Object.entries(pathValue))
    {
      switch (entryKey)
      {
        //Add parameters
        case 'parameters': {
          //Cast
          const parameters = entryValue as OpenAPIV3.ParameterObject[];

          for (const rawParameter of parameters)
          {
            //Translate the schema
            let parameterSchema: OperationSchema<any, true> | undefined;
            
            if (rawParameter.schema != null)
            {
              parameterSchema = await translateSchema(rawParameter.schema as OpenAPIV3.SchemaObject) as OperationSchema<any, true>;
              parameterSchema.required = rawParameter.required ?? false;
            }

            //Map
            const parameter = {
              name: rawParameter.name,
              description: rawParameter.description,
              schema: parameterSchema
            } as OperationParameter;

            //Add
            switch (rawParameter.in)
            {
              case 'path':
                pathParameters.push(parameter);
                break;

              case 'query':
                queryParameters.push(parameter);
                break;

              default:
                throw new Error(`Unknown parameter type ${rawParameter.in}!`);
            }
          }

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

          //Aggregate operation schemas and MIME types
          let requestSchema: OperationSchema | undefined;
          let requestMime: string | undefined;

          if (requestBody?.content != null)
          {
            //Get the contents
            const contents = Object.entries(requestBody?.content ?? {});

            //Ensure only one request content schemas was specified
            if (contents.length == 1)
            {
              //Get the content schema
              const contentSchema = contents[0]![1].schema;

              if (contentSchema == null)
              {
                throw new Error('Request content schema must be defined!');
              }

              //Translate the schema
              requestSchema = await translateSchema(contentSchema as OpenAPIV3.SchemaObject);

              //Update the MIME type
              requestMime = contents[0]![0];
            }
            else if (contents.length > 1)
            {
              throw new Error('Only one request content schema per operation is supported!');
            }
          }

          let responseSchema: OperationSchema | undefined;
          let responseMime: string | undefined;
          let responseStatus = -1;

          for (const [responseKey, responseValue] of Object.entries(operation.responses))
          {
            //Cast
            const response = responseValue as OpenAPIV3.ResponseObject;

            //Parse the status code
            const statusCode = parseInt(responseKey);

            //Skip non-200 responses
            if ((statusCode < 200 || 300 <= statusCode))
            {
              continue;
            }

            //Update the response status
            responseStatus = statusCode;

            if (response?.content != null)
            {
              //Get the contents
              const contents = Object.entries(response?.content ?? {});

              //Ensure only one response content schemas was specified
              if (contents.length == 1)
              {
                //Get the content schema
                const contentSchema = contents[0]![1].schema;

                if (contentSchema == null)
                {
                  throw new Error('Response content schema must be defined!');
                }

                //Translate the schema
                responseSchema = await translateSchema(contentSchema as OpenAPIV3.SchemaObject);

                //Update the MIME type
                responseMime = contents[0]![0];
              }
              else if (contents.length > 1)
              {
                throw new Error('Only one request content schema per operation is supported!');
              }
            }

            break;
          }

          //Convert path parameter format
          const path = pathKey.replace(/\{([^{}]+)\}/, ':$1');

          //Add the operation
          operations.push({
            name: operation.operationId,
            description: operation.summary,
            permission: operation.operationId,
            type: operationRecord['x-operation-type'],
            method: entryKey,
            path,
            pathParameters,
            queryParameters,
            requestSchema,
            requestMime,
            responseSchema,
            responseMime,
            responseStatus
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

//Export
export default getEntities;