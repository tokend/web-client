import EmailGetter from './EmailGetter'

import Vue from 'vue'
import { createLocalVue, shallowMount } from '@vue/test-utils'

import { MockHelper } from '@/test'

// HACK: https://github.com/vuejs/vue-test-utils/issues/532, waiting for
// Vue 2.6 so everything get fixed
Vue.config.silent = true

const localVue = createLocalVue()

describe('EmailGetter component unit test', () => {
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

  describe('created hook', () => {
    beforeEach(() => {
      EmailGetter.created.restore()
    })

    it('calls loadResult method if account ID is provided', async () => {
      const spy = sinon.stub(EmailGetter.methods, 'loadResult')

      await shallowMount(EmailGetter, {
        localVue,
        propsData: {
          accountId: ACCOUNT_ID
        }
      })

      expect(spy.calledOnce).to.be.true
    })

    it('calls loadResult method if balance ID is provided', async () => {
      const spy = sinon.stub(EmailGetter.methods, 'loadResult')

      await shallowMount(EmailGetter, {
        localVue,
        propsData: {
          balanceId: BALANCE_ID
        }
      })

      expect(spy.calledOnce).to.be.true
    })

    it('set isLoadingFailed property to true if neither account ID nor balance ID are provided', async () => {
      wrapper = await shallowMount(EmailGetter, {
        localVue
      })

      expect(wrapper.vm.isLoadingFailed).to.be.true
    })
  })

  describe('method', () => {
    describe('loadResult', () => {
      it('fetches user by account ID', async () => {
        sinon.stub(wrapper.vm, 'getAccountId').resolves(ACCOUNT_ID)
        const spy = sinon.stub(usersResource, 'get').resolves({ data: {} })

        await wrapper.vm.loadResult()

        expect(spy
          .withArgs(ACCOUNT_ID)
          .calledOnce
        ).to.be.true
      })

      it('sets the result property to fetched user email', async () => {
        const userResponse = {
          data: {
            email: 'foo@bar.com'
          }
        }
        sinon.stub(wrapper.vm, 'getAccountId').resolves()
        sinon.stub(usersResource, 'get').resolves(userResponse)

        await wrapper.vm.loadResult()

        expect(wrapper.vm.result).to.equal(userResponse.data.email)
      })

      it('sets the result property to account ID (if it is provided) if an error was thrown', async () => {
        wrapper.setProps({
          accountId: ACCOUNT_ID
        })
        sinon.stub(wrapper.vm, 'getAccountId').throws()
        sinon.stub(console, 'error')

        await wrapper.vm.loadResult()

        expect(wrapper.vm.result).to.equal(ACCOUNT_ID)
      })

      it('sets the result property to balance ID (if account ID is not provided) if an error was thrown', async () => {
        wrapper.setProps({
          balanceId: BALANCE_ID
        })
        sinon.stub(wrapper.vm, 'getAccountId').throws()
        sinon.stub(console, 'error')

        await wrapper.vm.loadResult()

        expect(wrapper.vm.result).to.equal(BALANCE_ID)
      })
    })

    describe('getAccountId', () => {
      it('returns account ID if it is provided', async () => {
        wrapper.setProps({
          accountId: ACCOUNT_ID
        })

        const response = await wrapper.vm.getAccountId()

        expect(response).to.equal(ACCOUNT_ID)
      })

      it('fetches account by balance ID (if it is provided, but account ID is not)', async () => {
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

      it('returns account ID fetched by balance ID (if it is provided, but account ID is not)', async () => {
        wrapper.setProps({
          balanceId: BALANCE_ID
        })
        sinon.stub(balancesResource, 'getAccount')
          .resolves({ data: { accountId: ACCOUNT_ID } })

        const result = await wrapper.vm.getAccountId()

        expect(result).to.equal(ACCOUNT_ID)
      })

      it('returns empty string if neither account ID nor balance ID are provided', async () => {
        const result = await wrapper.vm.getAccountId()

        expect(result).to.equal('')
      })
    })
  })
})
