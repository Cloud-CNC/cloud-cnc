/**
 * @fileoverview Hygen helpers
 */

//Export
module.exports = {
  helpers: {
    /**
     * Format a list with separators
     * @param {any[]} list List to format
     * @param {string} separator Item separator
     * @returns {[any, string][]} Formatted list for use in a for-of loop
     */
    list: (list, separator) => list.map((item, index) => [item, (index < list.length - 1) ? separator : '']),

    /**
     * Format raw text as a multiline comment
     * @param {string} raw Raw text
     * @param {number} indent Indent level
     * @returns Multiline comment
     */
    multiline: (raw, indent) => raw.trim().split(/[\r\n]{1,2}/).map(line => `${' '.repeat(indent)}* ${line}`).join('\n')
  }
};