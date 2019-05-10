import LoadAssetsMixin from './load-assets.mixin'

import { Wallet } from '@tokend/js-sdk'

import { mount, createLocalVue } from '@vue/test-utils'

import * as Api from '@/api'
import { Asset } from '../wrappers/asset'

const localVue = createLocalVue()

const Component = {
  template: `<div></div>`,
}

describe('Load assets mixin', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(Component, {
      mixins: [LoadAssetsMixin],
      localVue,
    })
  })

  describe('method', () => {
    describe('getAssetByCode', () => {
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

      it('calls Api.get method with provided params and returns instance of Asset record',
        async () => {
          sinon.stub(Api.api, 'get').resolves({ data: {} })

          const result = await wrapper.vm.getAssetByCode('USD')

          expect(Api.api.get)
            .to.have.been.calledOnceWithExactly('/v3/assets/USD')
          expect(result).to.be.instanceOf(Asset)

          Api.api.get.restore()
        })
    })
  })
})
