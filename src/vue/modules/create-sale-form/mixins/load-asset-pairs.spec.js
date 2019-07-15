import LoadAssetPairsMixin from './load-asset-pairs.mixin'

import { ASSET_POLICIES } from '@tokend/js-sdk'

import { mount, createLocalVue } from '@vue/test-utils'

import * as apiWrp from '@/api'
import { Asset } from '../wrappers/asset'

const localVue = createLocalVue()

const Component = {
  template: `<div></div>`,
}

describe('Load asset pairs mixin', () => {
  let sandbox
  let wrapper

  beforeEach(() => {
    sandbox = sinon.createSandbox()

    wrapper = mount(Component, {
      mixins: [LoadAssetPairsMixin],
      localVue,
    })
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('method', () => {
    describe('loadBaseAssetsByQuote', () => {
      it('calls api.get method with provided params and returns base assets',
        async () => {
          sandbox.stub(apiWrp.api, 'get').resolves('getResponseObject')
          sandbox.stub(apiWrp, 'loadingDataViaLoop')
            .withArgs('getResponseObject')
            .resolves([
              {
                baseAsset: {
                  id: 'BTC',
                  policies: { value: ASSET_POLICIES.baseAsset },
                },
              },
              {
                baseAsset: {
                  id: 'TKN',
                  policies: { value: 0 },
                },
              },
              {
                baseAsset: {
                  id: 'ETH',
                  policies: { value: ASSET_POLICIES.baseAsset },
                },
              },
            ])

          const result = await wrapper.vm.loadBaseAssetsByQuote('USD')

          expect(apiWrp.api.get)
            .to.have.been.calledOnceWithExactly(
              '/v3/asset_pairs',
              {
                filter: { quote_asset: 'USD' },
                page: { limit: 100 },
                include: ['base_asset'],
              }
            )
          expect(result).to.deep.equal([
            new Asset({
              id: 'BTC',
              policies: { value: ASSET_POLICIES.baseAsset },
            }),
            new Asset({
              id: 'ETH',
              policies: { value: ASSET_POLICIES.baseAsset },
            }),
          ])
        }
      )
    })
  })
})
