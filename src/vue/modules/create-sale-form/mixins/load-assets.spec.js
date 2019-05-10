import LoadAssetsMixin from './load-assets.mixin'

import { ApiCaller, ASSET_POLICIES } from '@tokend/js-sdk'

import { mount, createLocalVue } from '@vue/test-utils'

import * as Api from '@/api'
import { Asset } from '../wrappers/asset'

const localVue = createLocalVue()

const Component = {
  template: `<div></div>`,
  props: ['wallet'],
}

describe('Load assets mixin', () => {
  let sandbox
  let wrapper

  beforeEach(() => {
    sandbox = sinon.createSandbox()

    wrapper = mount(Component, {
      mixins: [LoadAssetsMixin],
      localVue,
    })
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('computed property', () => {
    describe('ownedAssets', () => {
      it('returns only owned assets', () => {
        wrapper.setProps({ wallet: { accountId: 'SOME_ACCOUNT_ID' } })
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
  })

  describe('method', () => {
    describe('loadAssets', () => {
      beforeEach(() => {
        sandbox.stub(Api, 'api').returns(ApiCaller.getInstance())
      })

      it('calls Api.getWithSignature method with provided params and sets assets property',
        async () => {
          wrapper.setProps({ wallet: { accountId: 'SOME_ACCOUNT_ID' } })
          sandbox.stub(Api.api, 'getWithSignature').resolves({
            data: {
              balances: [
                { asset: { id: 'USD' } },
                { asset: { id: 'BTC' } },
              ],
            },
          })

          await wrapper.vm.loadAssets()

          expect(Api.api.getWithSignature)
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
