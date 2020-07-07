import { BlobRecord } from './blob.record'

export class KycRecord {
  constructor (blob) {
    if (!(blob instanceof BlobRecord)) {
      throw TypeError('Expected blob to be a BlobRecord')
    }

    this._blob = blob
  }
}
