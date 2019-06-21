import { ErrorHandler } from '@/js/helpers/error-handler'

const DEFAULT_PAGE_LIMIT = 10

export class Collection {
  constructor (loader) {
    this._loader = loader
    this._isLoading = false
    this._isFailed = false
    this._isNoMoreEntries = false
    this._isFetchedFirst = true
    this._pageLimit = DEFAULT_PAGE_LIMIT
    this._errorHandler = ErrorHandler.processWithoutFeedback
    this._list = []
    this._nextPageLoader = () => {}
  }

  async loadPage () {
    this._isLoading = true

    try {
      let response
      if (this._isFetchedFirst) {
        response = await this._loader()
        this._list = response.data
      } else {
        response = await this._nextPageLoader()
        this._list = this._list.concat(response.data)
      }

      this._nextPageLoader = response.fetchNext
      this._isFetchedFirst = false
      this._isNoMoreEntries = response.data.length < this._pageLimit
    } catch (e) {
      this._isFailed = true
      this._errorHandler(e)
    }

    this._isLoading = false
  }

  get list () {
    return this._list
  }

  set loader (loader) {
    this._loader = loader
  }

  reload () {
    this._isFetchedFirst = true
    this.loadPage()
  }

  get isNoMoreEntries () {
    return this._isNoMoreEntries
  }

  get isLoading () {
    return this._isLoading
  }

  get isFailed () {
    return this._isFailed
  }

  get isEmpty () {
    return this._list.length > 0
  }

  set pageLimit (value) {
    this._pageLimit = value
  }

  set errorHandler (handler) {
    this._errorHandler = handler
  }
}
