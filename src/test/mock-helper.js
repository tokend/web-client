import { api } from '@/api'
import { Wallet } from '@tokend/js-sdk'
import mock from 'xhr-mock'

let apiInstance = null

const HORIZON_URL = 'https://test.api.com'

export class MockHelper {
  constructor () {
    apiInstance = api

    mock.setup()
    mock.reset()
    this.defaultAccountId = 'GBLPOFIGESQI7LG4ILTYHOMYTA7FBLG6G76DMNGZJDJSIO7VM3Z4YZ2J'
    this.defaultBalanceId = 'BDPFDXJAL6UY53L52NNWPD7RTAO4EVZL55SWHNYVYJQ44BOEIQKL4FOJ'
  }

  getMockWallet ({ walletId, accountId } = {}) {
    return new Wallet(
      'test@mail.com',
      'SCPIPHBIMPBMGN65SDGCLMRN6XYGEV7WD44AIDO7HGEYJUNDKNKEGVYE',
      accountId || this.defaultAccountId,
      walletId || '4aadcd4eb44bb845d828c45dbd68d5d1196c3a182b08cd22f05c56fcf15b153c',
    )
  }

  mockEndpoint (endpoint, response) {
    const url = `${HORIZON_URL}${endpoint}`
      .replace('@', '%40') // FIXME sorry

    mock.get(url, {
      status: 200,
      reason: 'OK',
      body: JSON.stringify(response),
    })
  }

  get getDefaultAccountId () {
    return this.defaultAccountId
  }

  get getDefaultBalanceId () {
    return this.defaultBalanceId
  }

  get apiInstance () {
    return apiInstance
  }
}
