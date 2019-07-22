import csvParseSync from 'csv-parse/lib/sync'
import _escapeRegExp from 'lodash/escapeRegExp'

// csv-parse docs: https://csv.js.org/parse/api/

export class CsvUtil {
  /**
   * Parse CSV string
   * @param {string} input The string to parse
   *
   * @param {object} [options] Options
   *
   * @param {string|string[]} [options.delimiters=,] Delimiters, can contain
   * multiple chars. If an array with multiple entries passed, the util will
   * try to parse with all the provided delimiters.
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
    if (typeof input !== 'string') {
      throw new Error(`CsvUtil.parse(): 'input' arg should be a string, got ${input}`)
    }

    if (Array.isArray(options.delimiters) && options.delimiters.length > 1) {
      input = this._replaceDelimiters(
        options.delimiters.slice(1),
        options.delimiters[0],
        input,
      )
    }

    const csvParseSyncOpts = {
      delimiter: Array.isArray(options.delimiters)
        ? options.delimiters[0] || ','
        : options.delimiters || ',',
      ltrim: options.trim || options.trimLeft || false,
      rtrim: options.trim || options.trimRight || false,
    }

    const parsed = csvParseSync(input, csvParseSyncOpts)

    if (options.filterEmpty) {
      return this._filterEmpty(parsed)
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

  /**
   * Delimiter presets
   */
  static get delimiters () {
    return {
      csv: ',',
      common: [',', '\n', '\t', ' ', ':'],
    }
  }

  static _replaceDelimiters (from = [], to = ',', input = '') {
    const searchRe = new RegExp(
      from.map(item => _escapeRegExp(item)).join('|'),
      'gm'
    )

    return input.replace(searchRe, to)
  }

  static _filterEmpty (rows) {
    return rows.map(row => {
      return row.filter(item => item !== undefined &&
        item !== null &&
        !/^\s*$/gi.test(item)
      )
    })
  }
}
