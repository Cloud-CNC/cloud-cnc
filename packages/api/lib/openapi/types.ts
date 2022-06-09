/**
 * @fileoverview OpenAPI Entity Types
 */

//Imports
import {OpenAPIV3} from 'openapi-types';

/**
 * Operation schema type
 */
export enum OperationSchemaType
{
  ARRAY = 'array',
  BOOLEAN = 'boolean',
  INTEGER = 'integer',
  NUMBER = 'number',
  OBJECT = 'object',
  STRING = 'string'
}

/**
 * Operation schema
 */
export interface OperationSchema<T extends OperationSchemaType = any, U = false>
{
  /**
   * Schema type
   */
  type: T;

  /**
   * Schema union (Only one of `allOf`, `anyOf`, `oneOf`, or `not` may be defined)
   */
  allOf?: OperationSchema[];

  /**
   * Schema union (Only one of `allOf`, `anyOf`, `oneOf`, or `not` may be defined)
   */
  anyOf?: OperationSchema[];

  /**
   * Schema union (Only one of `allOf`, `anyOf`, `oneOf`, or `not` may be defined)
   */
  oneOf?: OperationSchema[];

  /**
   * Schema negation (Only one of `allOf`, `anyOf`, `oneOf`, or `not` may be defined)
   */
  not?: OperationSchema;

  /**
   * Schema description
   */
  description?: string;

  /**
   * Minimum items/length/value (Only defined for `ARRAY`, `INTEGER`, `NUMBER`, `OBJECT`, and
   * `STRING` schema types)
   */
  minimum?: T extends OperationSchemaType.ARRAY | OperationSchemaType.INTEGER | OperationSchemaType.NUMBER | OperationSchemaType.OBJECT | OperationSchemaType.STRING ? number : undefined;

  /**
   * Whether or not the minimum value is exclusive (Only defined for `INTEGER` and `NUMBER` schema
   * types; defaults to `false`)
   */
  exclusiveMinimum?: T extends OperationSchemaType.INTEGER | OperationSchemaType.NUMBER ? boolean : undefined;

  /**
   * Maximum items/length/value (Only defined for `ARRAY`, `INTEGER`, `NUMBER`, `OBJECT`, and
   * `STRING` schema types)
   */
  maximum?: T extends OperationSchemaType.ARRAY | OperationSchemaType.INTEGER | OperationSchemaType.NUMBER | OperationSchemaType.OBJECT | OperationSchemaType.STRING ? number : undefined;

  /**
   * Whether or not the maximum value is exclusive (Only defined for `INTEGER` and `NUMBER` schema
   * types; defaults to `false`)
   */
  exclusiveMaximum?: T extends OperationSchemaType.INTEGER | OperationSchemaType.NUMBER ? boolean : undefined;

  /**
   * Sub-schema (Only defined for `ARRAY` and `OBJECT` schema types; only one of `subSchema and
   * `subSchemas` may be defined)
   */
  subSchema?: T extends OperationSchemaType.ARRAY | OperationSchemaType.OBJECT ? OperationSchema : undefined;

  /**
   * Whether or not all items must be unique (Only defined for `ARRAY` schema types; defaults to
   * `false`)
   */
  unique: T extends OperationSchemaType.ARRAY ? boolean : undefined;

  /**
   * Schema key (Only defined for `OBJECT` schema types)
   */
  key: T extends OperationSchemaType.OBJECT ? string : undefined;

  /**
   * Whether or not the field/parameter is required (Only defined for `OBJECT` schema types and
   * parameters; defaults to `false`)
   */
  required: T extends OperationSchemaType.OBJECT ? boolean : (U extends true ? boolean : undefined);

  /**
   * Sub-schemas (Only defined for `OBJECT` schema types; mutually-exclusively defined with
   * `subSchema`)
   */
  subSchemas?: T extends OperationSchemaType.OBJECT ? OperationSchema[] : undefined;

  /**
   * Enumerated values (Only defined for `STRING` schema types)
   */
  enum?: T extends OperationSchemaType.STRING ? string[] : undefined;

  /**
   * String format (Only defined for `STRING` schema types)
   */
  format?: T extends OperationSchemaType.STRING ? string : undefined;

  /**
   * Regular expression pattern (Only defined for `STRING` schema types)
   */
  pattern?: T extends OperationSchemaType.STRING ? string : undefined;

  /**
   * Whether or not the field should be included when fuzzy-searching (Only defined for `STRING`
   * schema types for `ALL` operation types; defaults to false)
   */
  searchable?: T extends OperationSchemaType.STRING ? boolean : undefined;
}

/**
 * Generic operation types
 */
export enum OperationType
{
  ALL = 'all',
  CREATE = 'create',
  GET = 'get',
  UPDATE = 'update',
  DELETE = 'delete'
}

/**
 * Operation parameter
 */
export interface OperationParameter
{
  /**
   * Parameter name
   */
  name: string;

  /**
   * Parameter description
   */
  description?: string;

  /**
   * Parameter schema
   */
  schema?: OperationSchema;
}

/**
 * Action performed upon an entity
 */
export interface EntityOperation
{
  /**
   * Operation name
   */
  name: string;

  /**
   * Operation description
   */
  description: string;

  /**
   * Operation permission name
   */
  permission: string;

  /**
   * Operation type (If applicable)
   */
  type?: OperationType;

  /**
   * HTTP method
   */
  method: OpenAPIV3.HttpMethods;

  /**
   * HTTP path
   */
  path: string;

  /**
   * Operation path parameters
   */
  pathParameters: OperationParameter[];

  /**
   * Operation path parameters
   */
  queryParameters: OperationParameter[];

  /**
   * Operation request schema
   */
  requestSchema?: OperationSchema;

  /**
   * Operation request MIME type
   */
  requestMime?: string;

  /**
   * Operation response schema
   */
  responseSchema?: OperationSchema;

  /**
   * Operation response MIME type
   */
  responseMime?: string;

  /**
   * Operation response status code
   */
  responseStatus: number;
}

/**
 * A distinct object which can be accessed and mutated by operations
 */
export interface Entity
{
  /**
   * Entity name
   */
  name: string;

  /**
   * Entity description
   */
  description: string;

  /**
   * Entity operations
   */
  operations: EntityOperation[];
}