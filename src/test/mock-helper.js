import { MockWrapper } from './index'
import { Sdk } from '../sdk'
import { Wallet } from '@tokend/js-sdk'
import mock from 'xhr-mock'

let sdkInstance = null

export class MockHelper {
  constructor () {
    Sdk.initSync('https://test.api.com')
    sdkInstance = Sdk.getInstance()
    mock.setup()
    mock.reset()
  }

  mockHorizonMethod (resource, method, mock) {
    this.mockMethod('horizon', resource, method, MockWrapper.makeHorizonResponse(mock))
  }

  mockApiMethod (resource, method, mock) {
    this.mockMethod('api', resource, method, MockWrapper.makeApiResponse(mock))
  }

  mockMethod (server, resource, method, mock, conditionFunc) {
    sinon.stub(sdkInstance[server][resource].constructor.prototype, method)
      .resolves(mock)
  }

  getHorizonResourcePrototype (resource) {
    return sdkInstance.horizon[resource].constructor.prototype
  }

  getApiResourcePrototype (resource) {
    return sdkInstance.api[resource].constructor.prototype
  }

  mockWallet ({ walletId, accountId } = {}) {
    sdkInstance.useWallet(new Wallet(
      'test@mail.com',
      'SCPIPHBIMPBMGN65SDGCLMRN6XYGEV7WD44AIDO7HGEYJUNDKNKEGVYE',
      accountId || 'GBLPOFIGESQI7LG4ILTYHOMYTA7FBLG6G76DMNGZJDJSIO7VM3Z4YZ2J',
      walletId || '4aadcd4eb44bb845d828c45dbd68d5d1196c3a182b08cd22f05c56fcf15b153c'
    ))
  }

  mockEndpoint (endpoint, response) {
    const url = `https://test.api.com${endpoint}`
      .replace('@', '%40') // FIXME sorry

    mock.get(url, {
      status: 200,
      reason: 'OK',
      body: JSON.stringify(response)
    })
  }
}
