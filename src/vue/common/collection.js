import { ErrorHandler } from '@/js/helpers/error-handler'

const DEFAULT_PAGE_LIMIT = 10

export class Collection {
  constructor (loader) {
    this._loader = loader
    this._isLoading = false
    this._isEmpty = true // delete
    this._isFailed = false
    this._isNoMoreEntries = false
    this._isFetchedFirst = true
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
        this._isEmpty = response.data.length === 0
      } else {
        response = await this._nextPageLoader()
        this._list = this._list.concat(response.data)
      }

      this._nextPageLoader = response.fetchNext
      this._isFetchedFirst = false
      this._isNoMoreEntries = response.data.length < DEFAULT_PAGE_LIMIT // сеттром пробрасывать

      return this._list
    } catch (e) {
      this._isFailed = true
      ErrorHandler.processWithoutFeedback(e) // сеттером пробрасывать ф-цю
    }

    this._isLoading = false
  }

  get list () {
    return this._list
  }

  set setLoader (loader) { // delete set
    this._loader = loader
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
    return this._isEmpty // listlength>0
  }

  reload () {
    this._isFetchedFirst = true
    return this.loadPage()
  }
}
