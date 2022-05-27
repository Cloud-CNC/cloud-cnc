/**
 * @fileoverview Typescript types
 */

/**
 * Add an `id` property to T
 */
export type WithID<T> = T & {
  /**
   * ID
   */
  id: string;
}