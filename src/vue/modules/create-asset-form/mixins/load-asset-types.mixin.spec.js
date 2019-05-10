import LoadAssetTypesMixin from './load-asset-types.mixin'

import { Wallet } from '@tokend/js-sdk'

import { mount, createLocalVue } from '@vue/test-utils'

import * as Api from '@/api'

const localVue = createLocalVue()

const Component = {
  template: '<div></div>',
}

describe('Load asset types mixin', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(Component, {
      mixins: [LoadAssetTypesMixin],
      localVue,
    })
  })

  describe('method', () => {
    describe('loadKycRequiredAssetType', () => {
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

      it('loads kycRequiredAssetType property using Api.get method',
        async () => {
          sinon.stub(Api.api, 'get').resolves({
            data: {
              value: { u32: 1 },
            },
          })

          await wrapper.vm.loadKycRequiredAssetType()

          expect(Api.api.get).to.have.been.calledOnceWithExactly(
            '/v3/key_values/asset_type:kyc_required'
          )
          expect(wrapper.vm.kycRequiredAssetType).to.equal(1)

          Api.api.get.restore()
        })
    })
  })
})
