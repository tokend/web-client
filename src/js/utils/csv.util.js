import csvParseSync from 'csv-parse/lib/sync'

// csv-parse docs: https://csv.js.org/parse/api/

export class CsvUtil {
  /**
   * Parse CSV string
   * @param {string} input The string to parse
   *
   * @param {object} [options] Options
   *
   * @param {string} [options.delimiters=,] Delimiters
   *
   * @param {boolean} [options.trimLeft=false] Ignore whitespace to left of all
   * fields. Does not remove whitespace in a quoted field.
   *
   * @param {boolean} [options.trimRight=false] Ignore whitespace to right of
   * all fields. Does not remove whitespace in a quoted field.
   *
   * @returns {Array} Array of arrays.  Each nester array represents a row.
   */
  static parse (input, options = {}) {
    if (!input || typeof input !== 'string') {
      throw new Error(`CsvUtil.parse(): 'input' arg should be a string, got ${input}`)
    }

    const csvParseSyncOpts = {
      delimiter: options.delimiters || ',',
      ltrim: options.trimLeft || false,
      rtrim: options.trimRight || false,
    }

    return csvParseSync(input, csvParseSyncOpts)
  }

  /**
   * The same as CsvUtil.parse() but returns concatenated result
   * @param  {...any} args
   */
  static parseConcat (...args) {
    const result = this.parse(...args)
    return [].concat(...result)
  }
}
