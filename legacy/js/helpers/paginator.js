import config from '../../../src/config'
import get from 'lodash/get'
import store from '../../vuex/index'
import cloneDeep from 'lodash'

const emptyWrp = r => r
const emptyAsync = () => Promise.resolve({
  next: emptyAsync,
  records: []
})

export class Paginator {
  /**
   * Class to facilitate horizon paginated requests. For now, can be used only
   * with js-sdk server.
   *
   * @constructor
   * @param {object} opts
   * @param {function} [opts.initLoader] - Initial function making request to
   *        horizon
   * @param {function} [opts.recordWrp] - To create specified instance from
   *        every record
   * @param {number} [opts.txPerPage] - Limit of transactions
   */
  /*
    TODO:
     txPerPage limit here is used only to check if all list is loaded.
     For now, only services can specify limit as a request param
     It may be a good idea to centralize pagination limit here
  */

  constructor (opts) {
    this._initLoader = get(opts, 'initLoader') || emptyAsync
    this._nextPageLoader = emptyAsync
    this._txPerPage = get(opts, 'txPerPage') || config.TRANSACTIONS_PER_PAGE
    this._recordWrp = get(opts, 'recordWrp') || emptyWrp

    this.records = []
    this.isLoaded = false
  }

  attachInitLoader (loader) {
    this._initLoader = loader
  }

  async init () {
    this._startLoad()
    const response = await this._initLoader(...arguments)
    const records = this._parseRecords(response.records)
    this.records = records

    this._nextPageLoader = response.next

    this._checkLoadState(response.records)
    return records
  }

  async next () {
    this._startLoad()
    const response = await this._nextPageLoader(store.getters.accountKeypair)
    const records = this._parseRecords(response.records)
    this.records = this.records.concat(records)
    this._nextPageLoader = response.next

    this._checkLoadState(response.records)
    return records
  }

  _pages () {
    const records = cloneDeep(this.records)
    const pages = []
    while (records.length) {
      pages.push(records.splice(0, this._txPerPage))
    }
    return pages
  }

  page (index) {
    return this._pages()[index] || []
  }

  _parseRecords (records) {
    if (!records) return []
    return this._recordWrp
      ? records.map(record => this._recordWrp(record))
      : records
  }

  _checkLoadState (records) {
    if (!records || records.length < this._txPerPage) {
      this._endLoad()
    }
  }

  _startLoad () {
    this.isLoaded = false
  }

  _endLoad () {
    this.isLoaded = true
  }
}
