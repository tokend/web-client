import EmailGetter from './EmailGetter'

import Vue from 'vue'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import { MockHelper } from '@/test'

import { Sdk } from '@/sdk'
import { ErrorHandler } from '@/js/helpers/error-handler'

// HACK: https://github.com/vuejs/vue-test-utils/issues/532, waiting for
// Vue 2.6 so everything get fixed
Vue.config.silent = true

const localVue = createLocalVue()

describe('EmailGetter\'s', () => {
  let sandbox
  beforeEach(() => (sandbox = sinon.createSandbox()))
  afterEach(() => sandbox.restore())

  describe('created hook', () => {
    it('calls init() method to initialize the component', async () => {
      const initStub = sandbox.stub(EmailGetter.methods, 'init')

      shallowMount(EmailGetter, { localVue })

      expect(initStub).to.has.been.called
    })
  })

  describe('method', () => {
    let wrapper

    beforeEach(async () => {
      sandbox.stub(EmailGetter, 'created').resolves()
      wrapper = await shallowMount(EmailGetter, { localVue })
    })

    describe('init()', () => {
      beforeEach(() => {
        sandbox.stub(wrapper.vm, 'loadEmail')
        sandbox.stub(Sdk, 'networkDetails').value({
          adminAccountId: 'MASTER_ACCOUNT_ID',
        })
      })

      it('does not fetch email if provided accountId is master', async () => {
        wrapper.setProps({ accountId: 'MASTER_ACCOUNT_ID' })

        wrapper.vm.init()

        expect(wrapper.vm.isMasterAccount).to.be.true
        expect(wrapper.vm.loadEmail).to.has.not.been.called
      })

      it('fetches email if account ID provided', async () => {
        wrapper.setProps({ accountId: 'SOME_ACCOUNT_ID' })

        wrapper.vm.init()

        expect(wrapper.vm.isMasterAccount).to.be.false
        expect(wrapper.vm.loadEmail).to.has.been.called
      })

      it('fetches email if balance ID is provided', async () => {
        wrapper.setProps({ balanceId: 'SOME_BALANCE_ID' })

        wrapper.vm.init()

        expect(wrapper.vm.isMasterAccount).to.be.false
        expect(wrapper.vm.loadEmail).to.has.been.called
      })

      it('does not fetches anything if no account id or balance id provided', async () => {
        wrapper.setProps({ accountId: '', balanceId: '' })

        wrapper.vm.init()

        expect(wrapper.vm.isMasterAccount).to.be.false
        expect(wrapper.vm.loadEmail).to.has.not.been.called
      })
    })

    describe('loadEmail()', () => {
      it('fetches email by account ID and assigns it', async () => {
        sandbox.stub(wrapper.vm, 'getEmailByAccountId')
          .withArgs('SOME_ACCOUNT_ID')
          .resolves('EMAIL')
        sandbox.stub(wrapper.vm, 'getAccountId')
          .resolves('SOME_ACCOUNT_ID')

        await wrapper.vm.loadEmail()

        expect(wrapper.vm.email).to.equal('EMAIL')
      })

      it('handles the occurred error', async () => {
        const theError = new Error()
        sandbox.stub(wrapper.vm, 'getAccountId').throws(theError)
        sandbox.stub(ErrorHandler, 'processWithoutFeedback')

        await wrapper.vm.loadEmail()

        expect(wrapper.vm.email).to.equal('')
        expect(ErrorHandler.processWithoutFeedback)
          .to.has.been.calledOnceWithExactly(theError)
      })
    })

    describe('getAccountId()', () => {
      it('simply returns account ID if present', async () => {
        wrapper.setProps({ accountId: 'SOME_ACCOUNT_ID' })

        const result = await wrapper.vm.getAccountId()

        expect(result).to.equal('SOME_ACCOUNT_ID')
      })

      it('fetches account id if balance id present but account id is not', async () => {
        const balancesResource = new MockHelper()
          .getHorizonResourcePrototype('balances')
        sandbox.stub(balancesResource, 'getAccount')
          .withArgs('SOME_BALANCE_ID')
          .resolves({ data: { accountId: 'FETCHED_ACCOUNT_ID' } })
        wrapper.setProps({ balanceId: 'SOME_BALANCE_ID' })

        const result = await wrapper.vm.getAccountId()

        expect(result).to.equal('FETCHED_ACCOUNT_ID')
      })

      it('returns empty string if neither balance id nor account are present', async () => {
        wrapper.setProps({ balanceId: '', accountId: '' })

        const result = await wrapper.vm.getAccountId()

        expect(result).to.equal('')
      })
    })
  })
})
