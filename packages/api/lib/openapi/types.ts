/**
 * @fileoverview OpenAPI Entity Types
 */

//Imports
import {OpenAPIV3} from 'openapi-types';

/**
 * Operation parameter
 */
export interface Parameter
{
  /**
   * Parameter name
   */
  name: string;

  /**
   * Parameter description
   */
  description: string;
}

/**
 * Operation field
 */
export interface Field
{
  /**
   * Field name
   */
  name: string;

  /**
   * Field description
   */
  description: string;

  /**
   * Joi field type literal
   */
  joiType: string;

  /**
   * TypeScript field type literal
   */
  typescriptType: string;

  /**
   * Whether or not the field is required
   */
  required: boolean;
}

/**
 * Generic operation types
 */
enum OperationType
{
  ALL = 'all',
  CREATE = 'create',
  GET = 'get',
  UPDATE = 'update',
  DELETE = 'delete'
}

/**
 * Action performed upon an entity
 */
export interface Operation
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
   * Operation parameters
   */
  parameters: Parameter[];

  /**
   * Operation fields
   */
  fields: Field[];
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
  operations: Operation[];
}