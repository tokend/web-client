import EmailGetter from './EmailGetter'

import Vue from 'vue'
import { createLocalVue, shallowMount } from '@vue/test-utils'

import { MockHelper } from '@/test'

// HACK: https://github.com/vuejs/vue-test-utils/issues/532, waiting for
// Vue 2.6 so everything get fixed
Vue.config.silent = true

const localVue = createLocalVue()

describe('EmailGetter component unit test', () => {
  describe('method', () => {
    const ACCOUNT_ID = 'accountId'
    const BALANCE_ID = 'balanceId'

    let mockHelper
    let balancesResource
    let usersResource

    let wrapper

    beforeEach(() => {
      mockHelper = new MockHelper()
      balancesResource = mockHelper.getHorizonResourcePrototype('balances')
      usersResource = mockHelper.getApiResourcePrototype('users')

      sinon.stub(EmailGetter, 'created').resolves()
      wrapper = shallowMount(EmailGetter, {
        localVue
      })
    })

    afterEach(() => {
      sinon.restore()
    })

    it('loadResult() is called inside created hook only when account ID or balance ID is present', async () => {
      EmailGetter.created.restore()
      const spy = sinon.stub(EmailGetter.methods, 'loadResult')

      await shallowMount(EmailGetter, {
        localVue,
        propsData: {
          accountId: ACCOUNT_ID
        }
      })

      expect(spy.calledOnce).to.be.true
    })

    it('loadResult() sets the result property to either account ID or balance ID if an error was thrown', async () => {
      wrapper.setProps({
        accountId: ACCOUNT_ID
      })
      sinon.stub(wrapper.vm, 'getAccountId').resolves(ACCOUNT_ID)
      sinon.stub(usersResource, 'get').throws()
      sinon.stub(console, 'error')

      await wrapper.vm.loadResult()

      expect(wrapper.vm.result).to.equal(ACCOUNT_ID)
    })

    it('getAccountId() returns account ID if both account ID and balance ID are present in props', async () => {
      wrapper.setProps({
        accountId: ACCOUNT_ID,
        balanceId: BALANCE_ID
      })

      const response = await wrapper.vm.getAccountId()

      expect(response).to.equal(ACCOUNT_ID)
    })

    it('getAccountId() calls horizon.balances.getAccount() with the correct params if only balance ID is present in props', async () => {
      wrapper.setProps({
        balanceId: BALANCE_ID
      })
      const spy = sinon.stub(balancesResource, 'getAccount')
        .resolves({ data: {} })

      await wrapper.vm.getAccountId()

      expect(spy
        .withArgs(BALANCE_ID)
        .calledOnce
      ).to.be.true
    })

    it('loadResult() calls the api.users.get() with the correct params', async () => {
      sinon.stub(wrapper.vm, 'getAccountId').resolves(ACCOUNT_ID)
      const spy = sinon.stub(usersResource, 'get').resolves({ data: {} })

      await wrapper.vm.loadResult()

      expect(spy
        .withArgs(ACCOUNT_ID)
        .calledOnce
      ).to.be.true
    })
  })
})
