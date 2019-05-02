import { Asset } from './asset'

export class AssetPair {
  constructor (record) {
    this.baseAsset = new Asset(record.baseAsset)
    this.quoteAsset = new Asset(record.quoteAsset)

    this.price = record.price
  }
}
