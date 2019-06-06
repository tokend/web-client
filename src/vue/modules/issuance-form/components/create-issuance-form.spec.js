import CreateIssuanceForm from './create-issuance-form'

import Vuelidate from 'vuelidate'
import Vuex from 'vuex'

import { createLocalVue, mount, shallowMount } from '@vue/test-utils'

import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'

const localVue = createLocalVue()
localVue.use(Vuelidate)

describe('Create issuance form', () => {
  const store = new Vuex.Store({
    modules: {
      account: {
        getters: {
          accountId: () => ('SOME_ACCOUNT_ID'),
        },
      },
    },
  })
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
      sandbox.stub(CreateIssuanceForm, 'created')
      wrapper = mount(CreateIssuanceForm, { localVue, store })
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
    it('sets first element of ownedAssets to form.asset property and calls loadFees method',
      async () => {
        sandbox.stub(CreateIssuanceForm.methods, 'loadFees').resolves()

        const wrapper = await shallowMount(CreateIssuanceForm, {
          localVue,
          store,
          propsData: {
            ownedAssets: ['USD', 'BTC'],
          },
        })

        expect(CreateIssuanceForm.methods.loadFees).to.have.been.calledOnce
        expect(wrapper.vm.form.asset).to.equal('USD')
      }
    )
  })

  describe('component', () => {
    let wrapper

    beforeEach(() => {
      sandbox.stub(CreateIssuanceForm, 'created')
      wrapper = shallowMount(CreateIssuanceForm, { localVue, store })
    })

    describe('method', () => {
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

      describe('loadFees', () => {
        it('calls calculateFees method and sets isFeesLoaded property', async () => {
          sandbox.stub(wrapper.vm, 'calculateFees').resolves({
            totalFee: {
              fixed: '0',
              calculatedPercent: '0',
            },
          })

          await wrapper.vm.loadFees()

          expect(wrapper.vm.calculateFees).to.have.been.calledOnce
          expect(wrapper.vm.isFeesLoaded).to.be.true
        })

        it('handles a thrown error properly', async () => {
          sandbox.stub(wrapper.vm, 'calculateFees').rejects()
          sandbox.stub(ErrorHandler, 'processWithoutFeedback')

          await wrapper.vm.loadFees()

          expect(ErrorHandler.processWithoutFeedback)
            .to.have.been.calledOnce
          expect(wrapper.vm.isFeesLoaded).to.be.false
          expect(wrapper.vm.isFeesLoadFailed).to.be.true
        })
      })
    })
  })
})
