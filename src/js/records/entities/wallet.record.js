import _get from 'lodash/get'

export class WalletRecord {
  constructor (record = {}, session = {}) {
    this._record = record

    this.id = record.id
    this.accountId = record.accountId
    this.email = record.email
    this.secretSeed = record.secretSeed

    this.sessionId = _get(session, 'id')
    this.sessionKey = _get(session, 'encryptionKey')
  }
}
