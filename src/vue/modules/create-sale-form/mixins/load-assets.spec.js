import LoadAssetsMixin from './load-assets.mixin'

import { ASSET_POLICIES } from '@tokend/js-sdk'

import { mount, createLocalVue } from '@vue/test-utils'

import { api } from '@/api'
import { Asset } from '../wrappers/asset'
import Vuex from 'vuex'

const localVue = createLocalVue()

const Component = {
  template: `<div></div>`,
}

describe('Load assets mixin', () => {
  let sandbox
  let wrapper
  let store

  beforeEach(() => {
    sandbox = sinon.createSandbox()
    store = new Vuex.Store({
      modules: {
        account: {
          getters: {
            accountId: () => ('SOME_ACCOUNT_ID'),
          },
        },
      },
    })

    wrapper = mount(Component, {
      mixins: [LoadAssetsMixin],
      store,
      localVue,
    })
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('computed property', () => {
    describe('ownedAssets', () => {
      it('returns only owned assets', () => {
        wrapper.setData({
          assets: [
            new Asset({
              id: 'USD',
              owner: { id: 'SOME_ACCOUNT_ID' },
            }),
            new Asset({
              id: 'BTC',
              owner: { id: 'OTHER_ACCOUNT_ID' },
            }),
            new Asset({
              id: 'ETH',
              owner: { id: 'SOME_ACCOUNT_ID' },
            }),
          ],
        })

        expect(wrapper.vm.ownedAssets).to.deep.equal([
          new Asset({
            id: 'USD',
            owner: { id: 'SOME_ACCOUNT_ID' },
          }),
          new Asset({
            id: 'ETH',
            owner: { id: 'SOME_ACCOUNT_ID' },
          }),
        ])
      })
    })

    describe('baseAssets', () => {
      it('returns only base assets', () => {
        wrapper.setData({
          assets: [
            new Asset({
              id: 'USD',
              policies: { value: ASSET_POLICIES.baseAsset },
            }),
            new Asset({
              id: 'BTC',
              policies: { value: ASSET_POLICIES.baseAsset },
            }),
            new Asset({
              id: 'ETH',
              policies: { value: 0 },
            }),
          ],
        })

        expect(wrapper.vm.baseAssets).to.deep.equal([
          new Asset({
            id: 'USD',
            policies: { value: ASSET_POLICIES.baseAsset },
          }),
          new Asset({
            id: 'BTC',
            policies: { value: ASSET_POLICIES.baseAsset },
          }),
        ])
      })
    })

    describe('defaultQuoteAsset', () => {
      it('returns default quote asset code', () => {
        wrapper.setData({
          assets: [
            new Asset({
              id: 'BTC',
              policies: { value: ASSET_POLICIES.baseAsset },
            }),
            new Asset({
              id: 'USD',
              policies: { value: ASSET_POLICIES.statsQuoteAsset },
            }),
          ],
        })

        expect(wrapper.vm.defaultQuoteAsset).to.equal('USD')
      })
    })
  })

  describe('method', () => {
    describe('loadAssets', () => {
      it('calls api.getWithSignature method with provided params and sets assets property',
        async () => {
          sandbox.stub(api, 'getWithSignature').resolves({
            data: {
              balances: [
                { asset: { id: 'USD' } },
                { asset: { id: 'BTC' } },
              ],
            },
          })

          await wrapper.vm.loadAssets('SOME_ACCOUNT_ID')

          expect(api.getWithSignature)
            .to.have.been.calledOnceWithExactly(
              '/v3/accounts/SOME_ACCOUNT_ID',
              { include: ['balances.asset'] }
            )
          expect(wrapper.vm.assets).to.deep.equal([
            new Asset({ id: 'USD' }),
            new Asset({ id: 'BTC' }),
          ])
        }
      )
    })
  })
})
