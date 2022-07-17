/**
 * @fileoverview Utilities
 */

//Imports
import createWatcher from 'node-watch';
import {copy} from 'fs-extra';
import {join} from 'path';
import {rm} from 'fs/promises';

/**
 * Synchronize src to dest
 * 
 * *Note: this function will overwrite the destination!*
 * @param src Source path
 * @param dest Destination path
 * @param watch Whether or not to watch src for updates and resynchronize dest each time
 */
export const synchronize = async (src: string, dest: string, watch: boolean) =>
{
  //Update once
  await copy(src, dest, {
    overwrite: true,
    recursive: true
  });

  //Watch and re-update as needed
  if (watch)
  {
    const watcher = createWatcher(src, {
      recursive: true
    }, async (event, srcPath) =>
    {
      //Compute the destination path (Strip the top-most folder and combine with the destination directory)
      const destPath = join(dest, srcPath.replace(/^[/\\]?[^/\\]+(?:([/\\])|$)/g, '$1'));

      //Update
      switch (event)
      {
        case 'update':
          //Copy
          try
          {
            await copy(srcPath, destPath, {
              overwrite: true,
              recursive: true
            });
          }
          catch (error)
          {
            console.warn(`Error while synchronizing source code: ${error}`);
          }
          break;

        case 'remove':
          //Remove
          try
          {
            await rm(destPath, {
              recursive: true
            });
          }
          catch (error)
          {
            console.warn(`Error while synchronizing source code: ${error}`);
          }
          break;

        default:
          throw new Error(`Unknown node-watch event ${event}!`);
      }
    });

    //Cleanup when exiting
    process.on('exit', watcher.close);
  }
};