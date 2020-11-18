import FeesMixin from './fees.mixin'

import { mount, createLocalVue } from '@vue/test-utils'

import { api } from '@/api'
import { FEE_TYPES } from '@tokend/js-sdk'

import { Fee } from './fee'

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
