import { mutations, actions, getters } from './assets.module'
import { vuexTypes } from './types'

import { api } from '../api'
import { AssetRecord } from '@/js/records/entities/asset.record'

describe('assets.module', () => {
  afterEach(() => {
    sinon.restore()
  })

  describe('mutations', () => {
    let state
    beforeEach(() => {
      state = {
        assets: [],
      }
    })

    it('SET_ASSETS should properly modify state', () => {
      mutations[vuexTypes.SET_ASSETS](state, [{ id: 'BTC' }, { id: 'USD' }])

      expect(state.assets).to.deep.equal([{ id: 'BTC' }, { id: 'USD' }])
    })

    it('UPDATE_ASSETS should properly modify state', () => {
      state.assets = [
        { id: 'TKN' },
        { id: 'BTC' },
      ]

      mutations[vuexTypes.UPDATE_ASSETS](state, [{ id: 'BTC', type: 1 }])

      expect(state.assets).to.deep.equal([
        { id: 'TKN' },
        { id: 'BTC', type: 1 },
      ])
    })
  })

  describe('actions', () => {
    let store

    beforeEach(() => {
      store = {
        state: {},
        commit: sinon.stub(),
      }
    })

    it('LOAD_ASSETS should commit the proper set of mutations', async () => {
      sinon.stub(api, 'get').resolves({
        data: [
          { id: 'BTC' },
          { id: 'USD' },
        ],
      })

      await actions[vuexTypes.LOAD_ASSETS](store)

      expect(store.commit).to.have.been.calledOnceWithExactly(
        vuexTypes.SET_ASSETS,
        [
          { id: 'BTC' },
          { id: 'USD' },
        ],
      )
    })
  })

  describe('getters', () => {
    it('assets', () => {
      const state = {
        assets: [
          { id: 'BTC' },
          { id: 'USD' },
          { id: 'ETH' },
        ],
      }

      expect(getters[vuexTypes.assets](state))
        .to.deep.equal([
          new AssetRecord({ id: 'BTC' }),
          new AssetRecord({ id: 'USD' }),
          new AssetRecord({ id: 'ETH' }),
        ])
    })

    it('assetByCode', () => {
      const assetGetters = {
        [vuexTypes.assets]: getters[vuexTypes.assets]({
          assets: [
            { id: 'BTC' },
            { id: 'USD' },
            { id: 'ETH' },
          ],
        }),
      }

      expect(getters[vuexTypes.assetByCode](null, assetGetters)('USD'))
        .to.deep.equal(new AssetRecord({ id: 'USD' }))
    })
  })
})
