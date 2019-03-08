import { types } from './types'
import { feesModule } from './index'

import { Wallet } from '@tokend/js-sdk'
import * as Api from '../_api'

import Vuex from 'vuex'
import Vue from 'vue'

import { Fee } from '../wrappers/fee'

Vue.use(Vuex)

describe('fees.module end-to-end test', () => {
  const config = {
    horizonUrl: 'https://test.api.com',
  }
  const wallet = new Wallet(
    'test@mail.com',
    'SCPIPHBIMPBMGN65SDGCLMRN6XYGEV7WD44AIDO7HGEYJUNDKNKEGVYE',
    'GDIU5OQPAFPNBP75FQKMJTWSUKHTQTBTHXZWIZQR4DG4QRVJFPML6TTJ',
    '4aadcd4eb44bb845d828c45dbd68d5d1196c3a182b08cd22f05c56fcf15b153c'
  )
  const fees = [
    {
      fixed: '1.000000',
    },
    {
      percent: '2.000000',
    },
  ]

  let store

  beforeEach(async () => {
    store = new Vuex.Store(feesModule)

    Api.initApi(wallet, config)
    sinon.stub(Api.api(), 'getWithSignature').resolves({ data: { fees } })

    await store.dispatch(types.LOAD_ACCOUNT_FEES)
  })

  afterEach(() => {
    Api.api().getWithSignature.restore()
  })

  it('fees', () => {
    expect(store.getters[types.fees])
      .to.deep.equal(fees.map(f => new Fee(f)))
  })
})
