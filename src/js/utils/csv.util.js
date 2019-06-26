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
   * @param {boolean} [options.trim=false] Enables both trimLeft and trimRight
   *
   * @param {boolean} [options.filterEmpty=false] Filters out empty
   * strings (`/^\s*$/`), null and undefined values.
   *
   * @returns {Array} Array of arrays.  Each nester array represents a row.
   */
  static parse (input, options = {}) {
    if (!input || typeof input !== 'string') {
      throw new Error(`CsvUtil.parse(): 'input' arg should be a string, got ${input}`)
    }

    const csvParseSyncOpts = {
      delimiter: options.delimiters || ',',
      ltrim: options.trim || options.trimLeft || false,
      rtrim: options.trim || options.trimRight || false,
    }

    const parsed = csvParseSync(input, csvParseSyncOpts)

    if (options.filterEmpty) {
      return parsed.map(row => {
        return row.filter(item => item !== undefined &&
          item !== null &&
          !/^\s*$/gi.test(item)
        )
      })
    } else {
      return parsed
    }
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
