import { LocalStorageViewer } from 'L@/js/utils/local-storage-viewer.util'
import { SaleRequestRecord } from 'L@/js/records/sale_request.record'
import store from 'L@/vuex'
const storageKey = `saleList-${store.getters.accountId}`
let localStorageViewer

export class SaleListManager {
  constructor () {
    this._fromStorage = []
    this._fromHorizon = []
    localStorageViewer = new LocalStorageViewer()
  }

  async fetch () {
    await this._loadFromHorizon()
    this._deriveFromStorage()
  }

  _loadFromHorizon () {
    // wip
  }

  _deriveFromStorage () {
    localStorageViewer.pop()
    this._fromStorage = (localStorageViewer.get(storageKey) || [])
      .map(request => new SaleRequestRecord(request))
  }

  pushToStorage () {
    localStorageViewer.set(storageKey, this._fromStorage.map(request =>
      request.getDetailsForSave()
    ))
    localStorageViewer.push()
  }

  add (item) {
    this._fromStorage.push(item)
  }

  drop (saleToDrop) {
    const i = this._fromStorage.findIndex(sale =>
      sale.saleIndex === saleToDrop.saleIndex
    )
    this._fromStorage.splice(i, 1)
    this.pushToStorage()
  }

  get list () {
    return [
      ...this._fromHorizon,
      ...this._fromStorage
    ]
  }
}
