import LoadOwnedAssetsMixin from './load-owned-assets.mixin'

import { Wallet } from '@tokend/js-sdk'

import { mount, createLocalVue } from '@vue/test-utils'

import * as Api from '../_api'
import { Asset } from '../wrappers/asset'

const localVue = createLocalVue()

const Component = {
  template: `<div></div>`,
}

describe('Load assets mixin', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(Component, {
      mixins: [LoadOwnedAssetsMixin],
      localVue,
    })
  })

  describe('method', () => {
    describe('loadOwnedAssets', () => {
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
          sinon.stub(Api.api(), 'get').resolves({
            data: {
              balances: [
                { asset: { id: 'USD', owner: { id: 'SOME_ACCOUNT_ID' } } },
                { asset: { id: 'BTC' } },
              ],
            },
          })

          await wrapper.vm.loadOwnedAssets('SOME_ACCOUNT_ID')

          expect(Api.api().get)
            .to.have.been.calledOnceWithExactly(
              '/v3/accounts/SOME_ACCOUNT_ID',
              { include: ['balances.asset'] }
            )
          expect(wrapper.vm.ownedAssets).to.deep.equal([
            new Asset({ id: 'USD', owner: { id: 'SOME_ACCOUNT_ID' } }),
          ])

          Api.api().get.restore()
        }
      )
    })
  })
})
