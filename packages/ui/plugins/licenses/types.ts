/**
 * @fileoverview TypeScript types
 */

/**
 * Plugin options
 */
export interface Options
{
  /**
   * Output path
   * @default `licenses.txt`
   */
  path: string;
}

/**
 * Package metadata
 */
export interface PackageMetadata
{
  /**
   * Package name
   */
  name: string;

  /**
  * Package URL
  */
  url?: string;
}

/**
 * License metadata
 */
export interface LicenseMetadata
{
  /**
   * License packages
   */
  packages: PackageMetadata[];

  /**
   * License text
   */
  text: string;
}