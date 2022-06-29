/**
 * @fileoverview Wormhole composables (Loosely based on Portal Vue)
 * 
 * * Black hole: a place where content enters a wormhole
 * * White hole: a place where content exits a wormhole
 * * Wormhole: a collection of black holes and exactly one white hole
 */

//Imports
import {Ref, Slot} from 'vue';

/**
 * Black hole information
 */
export interface BlackHole
{
  /**
   * Internal cache key
   * @internal
   */
  cacheKey: number;

  /**
   * Slot props
   */
  props?: any;

  /**
   * Default slot
   */
  slot?: Slot;
}

/**
 * Wormhole information
 */
export interface Wormhole
{
  /**
   * Black holes
   */
  blackHoles: Ref<BlackHole>[];
}

/**
 * Wormholes singleton
 * 
 * * Keys: worm hole name
 * * Values: worm hole information
 */
const wormholes = reactive(new Map<string, Wormhole>());

/**
 * Open a new black hole in a wormhole (To inject content into the wormhole)
 * @param name Wormhole name (Must be unique among all wormholes)
 * @param blackHole Black hole information
 */
export const useBlackHole = (name: string, blackHole: Ref<BlackHole>) =>
{
  //Get the wormhole
  let wormhole = wormholes.get(name);

  //Initialize the wormhole if non-existent
  if (wormhole == null)
  {
    wormhole = {
      blackHoles: []
    } as Wormhole;
  }

  //Add the black hole
  wormhole.blackHoles.push(blackHole);

  //Update the wormhole
  wormholes.set(name, wormhole);

  //Delete callback
  const deleteBlackHole = () =>
  {
    //Get the wormhole
    const wormhole = wormholes.get(name);

    if (wormhole != null)
    {
      //Delete the black hole
      wormhole.blackHoles = wormhole.blackHoles.filter(hole => hole != blackHole);

      //Update the wormhole
      wormholes.set(name, wormhole);
    }
  };

  return {
    deleteBlackHole
  };
};

/**
 * Open a white hole in a wormhole (To release content from the wormhole)
 * @param name Wormhole name (Must be unique among all wormholes)
 * @returns Black holes associated with the wormhole
 */
export const useWhiteHole = (name: string) =>
{
  //Get the wormhole
  const wormhole = eagerComputed(() => wormholes.get(name));

  //Delete callback
  const deleteWormhole = () => wormholes.delete(name);

  return {
    wormhole,
    deleteWormhole
  };
};