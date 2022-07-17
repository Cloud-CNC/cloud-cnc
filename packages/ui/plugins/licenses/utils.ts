/**
 * @fileoverview Utilities
 */

//Imports
import {LicenseMetadata, PackageMetadata} from './types';
import {getPackages} from '@lerna/project';
import {init as licenseChecker, ModuleInfos} from 'license-checker-rseidelsohn';
import {readFile} from 'fs/promises';

/**
 * Aggregate licenses
 * @param root Monorepo root directory
 * @returns Licenses
 */
export const aggregate = async (root: string) =>
{
  //Get all Lerna packages
  const lernaPackages = await getPackages(root);

  //Get all licenses
  const licenses = [] as LicenseMetadata[];
  for (const lernaPackage of lernaPackages)
  {
    //Get the modules
    const modules = await new Promise<ModuleInfos>((resolve, reject) => licenseChecker({
      start: lernaPackage.location
    }, (error, modules) =>
    {
      if (error != null)
      {
        reject(error);
      }
      else
      {
        resolve(modules);
      }
    }));

    //Add the licenses
    for (const [key, value] of Object.entries(modules))
    {
      //Get the package name
      let name: string;

      if (value.name != null)
      {
        name = value.name;
      }
      else
      {
        //Strip the version
        name = key.replace(/@[^@~/]+$/, '');
      }

      //Get the package URL
      let url: string | undefined;

      if (value.url != null)
      {
        url = value.url;
      }
      else if (value.repository != null)
      {
        //Strip Git scheme-prefix and file-extension
        url = value.repository.replace(/(?:^git\+|\.git#\w+$)/g, '');

        //Replace unknown schemes with HTTPS
        url = url.replace(/^(?!http|https)[^:]+:\/\//, 'https://');
      }

      //Read the license text
      let text: string | undefined;

      if (value.licenseFile != null)
      {
        text = await readFile(value.licenseFile, 'utf-8');
      }
      else if (value.licenseText != null)
      {
        text = value.licenseText;
      }
      else if (value.licenses != null)
      {
        text = typeof value.licenses == 'string' ? value.licenses : value.licenses.join(', ');
      }
      else
      {
        text = 'N/A';
      }

      //Get the license package
      const newPackage = {
        name,
        url
      } as PackageMetadata;

      //Get the existing license
      let license = licenses.find(license => license.text == text);

      //Create the license
      if (license == null)
      {
        license = {
          packages: [newPackage],
          text
        };

        //Add the license
        licenses.push(license);
      }
      //Add to existing license if not already added
      else if (license.packages.find(existingPackage => existingPackage == newPackage) == null)
      {
        license.packages.push(newPackage);
      }
    }
  }

  return licenses;
};