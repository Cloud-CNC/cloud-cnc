
/**
 * @fileoverview AVA unit test runner config
 */

//Export
export default {
  extensions: {
    ts: 'module'
  },
  nodeArguments: [
    '--experimental-specifier-resolution=node',
    '--loader=../../lib/loader.js'
  ],
  snapshotDir: 'snapshots',
  timeout: '30s'
};