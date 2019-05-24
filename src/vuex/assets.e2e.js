import Vue from 'vue'
import Vuex from 'vuex'

import assets from './assets.module'
import { vuexTypes } from './types'

import { api } from '@/api'
import { AssetRecord } from '@/js/records/entities/asset.record'

Vue.use(Vuex)

describe('assets.module end-to-end test', () => {
  describe('LOAD_ASSETS should update all the getters properly', () => {
    let store

    beforeEach(() => {
      store = new Vuex.Store({
        actions: {},
        getters: {},
        mutations: {},
        state: {},
        modules: { assets },
      })
    })

    afterEach(() => {
      sinon.restore()
    })

    it('factors', async () => {
      sinon.stub(api, 'get').resolves({
        data: [
          { id: 'BTC' },
          { id: 'USD' },
        ],
        fetchNext: sinon.stub().resolves({
          data: [{ id: 'ETH' }],
          fetchNext: sinon.stub().resolves({ data: [] }),
        }),
      })

      await store.dispatch(vuexTypes.LOAD_ASSETS)

      expect(store.getters[vuexTypes.assets])
        .to.deep.equal([
          new AssetRecord({ id: 'BTC' }),
          new AssetRecord({ id: 'USD' }),
          new AssetRecord({ id: 'ETH' }),
        ])
    })
  })
})
