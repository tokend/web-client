import LoadAssetsMixin from './load-assets.mixin'

import { Wallet, ASSET_POLICIES } from '@tokend/js-sdk'

import { mount, createLocalVue } from '@vue/test-utils'

import * as Api from '../_api'
import { Asset } from '../wrappers/asset'

const localVue = createLocalVue()

const Component = {
  template: `<div></div>`,
  props: ['wallet'],
}

describe('Load assets mixin', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(Component, {
      mixins: [LoadAssetsMixin],
      localVue,
    })
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
        const wallet = new Wallet(
          'test@mail.com',
          'SCPIPHBIMPBMGN65SDGCLMRN6XYGEV7WD44AIDO7HGEYJUNDKNKEGVYE',
          'GDIU5OQPAFPNBP75FQKMJTWSUKHTQTBTHXZWIZQR4DG4QRVJFPML6TTJ',
          '4aadcd4eb44bb845d828c45dbd68d5d1196c3a182b08cd22f05c56fcf15b153c'
        )
        const config = {
          horizonURL: 'https://test.api.com',
        }

        Api.initApi(wallet, config)
      })

      it('calls Api.getWithSignature method with provided params and sets assets property',
        async () => {
          wrapper.setProps({ wallet: { accountId: 'SOME_ACCOUNT_ID' } })
          sinon.stub(Api.api(), 'getWithSignature').resolves({
            data: {
              balances: [
                { asset: { id: 'USD' } },
                { asset: { id: 'BTC' } },
              ],
            },
          })

          await wrapper.vm.loadAssets()

          expect(Api.api().getWithSignature)
            .to.have.been.calledOnceWithExactly(
              '/v3/accounts/SOME_ACCOUNT_ID',
              { include: ['balances.asset'] }
            )
          expect(wrapper.vm.assets).to.deep.equal([
            new Asset({ id: 'USD' }),
            new Asset({ id: 'BTC' }),
          ])

          Api.api().getWithSignature.restore()
        }
      )
    })
  })
})
