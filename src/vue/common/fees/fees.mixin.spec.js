import FeesMixin from './fees.mixin'

import { mount, createLocalVue } from '@vue/test-utils'

import { api } from '@/api'
import { FEE_TYPES, PAYMENT_FEE_SUBTYPES } from '@tokend/js-sdk'

import { Fee } from './fee'
import { FeesCollection } from './fees-collection'
import { AssetRecord } from '@/js/records/entities/asset.record'

const localVue = createLocalVue()

const Component = {
  template: `<div></div>`,
}

describe('Fees mixin', () => {
  let sandbox
  let wrapper

  beforeEach(() => {
    sandbox = sinon.createSandbox()
    wrapper = mount(Component, {
      mixins: [FeesMixin],
      localVue,
    })
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('method', () => {
    describe('calculateFees', () => {
      it('calls proper methods wih correct params and returns FeesCollection instance',
        async () => {
          sandbox.stub(wrapper.vm, 'getAssetByCode').resolves({})
          sandbox.stub(wrapper.vm, 'calculateFee').resolves(new Fee({}))

          const result = await wrapper.vm.calculateFees({
            assetCode: 'USD',
            amount: '10.000000',
            type: FEE_TYPES.investFee,
            senderAccountId: 'SOME_ACCOUNT_ID',
          })

          expect(wrapper.vm.calculateFee)
            .to.have.been.calledOnceWithExactly({
              accountId: 'SOME_ACCOUNT_ID',
              type: FEE_TYPES.investFee,
              subtype: PAYMENT_FEE_SUBTYPES.outgoing,
              assetCode: 'USD',
              amount: '10.000000',
            })
          expect(result).to.be.instanceOf(FeesCollection)
        }
      )
    })

    describe('getAssetByCode', () => {
      it('calls api.get and returns AssetRecord instance', async () => {
        sandbox.stub(api, 'get').resolves({ data: {} })

        const result = await wrapper.vm.getAssetByCode('USD')

        expect(api.get).to.have.been.calledOnceWithExactly('/v3/assets/USD')
        expect(result).to.be.instanceOf(AssetRecord)
      })
    })

    describe('calculateFee', () => {
      it('calls api.get with proper params and returns Fee instance', async () => {
        sandbox.stub(api, 'get').resolves({ data: {} })

        const result = await wrapper.vm.calculateFee({
          accountId: 'SOME_ACCOUNT_ID',
          type: FEE_TYPES.investFee,
          assetCode: 'USD',
          subtype: 2,
          amount: '10.000000',
        })

        expect(api.get).to.have.been.calledOnceWithExactly(
          '/v3/accounts/SOME_ACCOUNT_ID/calculated_fees',
          {
            fee_type: FEE_TYPES.investFee,
            asset: 'USD',
            amount: '10.000000',
          }
        )
        expect(result).to.be.instanceOf(Fee)
      })
    })
  })
})
