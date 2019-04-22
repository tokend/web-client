import CreateIssuanceForm from './create-issuance-form'

import Vuelidate from 'vuelidate'

import { createLocalVue, mount, shallowMount } from '@vue/test-utils'

import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'

const localVue = createLocalVue()
localVue.use(Vuelidate)

describe('Create issuance form', () => {
  let sandbox

  beforeEach(() => {
    sandbox = sinon.createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('validation rules assigned correctly', () => {
    let wrapper

    beforeEach(() => {
      wrapper = mount(CreateIssuanceForm, { localVue })
    })

    const expectedResults = {
      asset: ['required'],
      amount: ['required', 'amountRange', 'maxDecimalDigitsCount'],
      receiver: ['required', 'emailOrAccountId'],
      reference: ['required', 'maxLength'],
    }

    for (const [model, rules] of Object.entries(expectedResults)) {
      it(`${model} model is validating by proper set of rules`, () => {
        expect(Object.keys(wrapper.vm.$v.form[model].$params))
          .to.deep.equal(rules)
      })
    }

    const fieldBindings = {
      '[name=create-issuance-asset]': 'asset',
      '[name=create-issuance-amount]': 'amount',
      '[name=create-issuance-receiver]': 'receiver',
      '[name=create-issuance-reference]': 'reference',
    }

    for (const [selector, model] of Object.entries(fieldBindings)) {
      it(`$v.form.${model} is touched after blur event emitted on ${selector}`, () => {
        sandbox.stub(wrapper.vm, 'touchField')

        wrapper.find(selector).vm.$emit('blur')

        expect(wrapper.vm.touchField.calledOnce).to.be.true
      })
    }
  })

  describe('created hook', () => {
    it('sets first element of ownedAssets to form.asset property', () => {
      const wrapper = shallowMount(CreateIssuanceForm, {
        localVue,
        propsData: {
          ownedAssets: ['USD', 'BTC'],
        },
      })

      expect(wrapper.vm.form.asset).to.equal('USD')
    })
  })

  describe('component', () => {
    let wrapper

    beforeEach(() => {
      sandbox.stub(CreateIssuanceForm, 'created')
      wrapper = shallowMount(CreateIssuanceForm, { localVue })
    })

    describe('submit', () => {
      it('calls proper methods and emits proper event', async () => {
        sandbox.stub(wrapper.vm, 'createIssuance').resolves()
        sandbox.stub(Bus, 'success')
        sandbox.stub(wrapper.vm, 'hideConfirmation')

        await wrapper.vm.submit()

        expect(wrapper.vm.createIssuance)
          .to.have.been.calledOnce
        expect(Bus.success).to.have.been.calledOnce
        expect(wrapper.emitted('submit')).to.exist
        expect(wrapper.vm.hideConfirmation).to.have.been.calledOnce
      })

      it('handles a thrown error properly', async () => {
        sandbox.stub(wrapper.vm, 'createIssuance').rejects()
        sandbox.stub(ErrorHandler, 'process')

        await wrapper.vm.submit()

        expect(ErrorHandler.process).to.have.been.calledOnce
      })
    })
  })
})
