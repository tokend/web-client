import AdvancedStepForm from './advanced-step-form'

import Vuelidate from 'vuelidate'

import { createLocalVue, mount, shallowMount } from '@vue/test-utils'

const localVue = createLocalVue()
localVue.use(Vuelidate)

describe('Advanced step form', () => {
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
      wrapper = mount(AdvancedStepForm, { localVue })
    })

    const expectedResults = {
      preissuedAssetSigner: ['required'],
      initialPreissuedAmount: ['required', 'amountRange'],
    }

    for (const [model, rules] of Object.entries(expectedResults)) {
      it(`${model} model is validating by proper set of rules`, () => {
        expect(Object.keys(wrapper.vm.$v.form[model].$params))
          .to.deep.equal(rules)
      })
    }

    const fieldBindings = {
      '[name=create-asset-preissued-asset-signer]': 'preissuedAssetSigner',
      '[name=create-asset-initial-preissued-amount]': 'initialPreissuedAmount',
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
    it('calls populateForm only if request was passed as a prop', () => {
      sandbox.stub(AdvancedStepForm.methods, 'populateForm')

      shallowMount(AdvancedStepForm, { localVue })
      expect(AdvancedStepForm.methods.populateForm)
        .to.have.not.been.called

      shallowMount(AdvancedStepForm, {
        localVue,
        propsData: {
          request: { id: '1' },
        },
      })
      expect(AdvancedStepForm.methods.populateForm)
        .to.have.been.calledOnce
    })
  })

  describe('component', () => {
    let wrapper

    beforeEach(() => {
      wrapper = shallowMount(AdvancedStepForm, { localVue })
    })

    describe('populateForm', () => {
      it('properly sets request prop fields to form property', () => {
        wrapper.setProps({
          request: {
            preissuedAssetSigner: 'SIGNER_ID',
            initialPreissuedAmount: '500.000000',
          },
        })

        wrapper.vm.populateForm()

        expect(wrapper.vm.form.isPreissuanceDisabled).to.be.false
        expect(wrapper.vm.form.preissuedAssetSigner).to.equal('SIGNER_ID')
        expect(wrapper.vm.form.initialPreissuedAmount).to.equal('500.000000')
      })
    })

    describe('submit', () => {
      it('emits submit event with correct payload', () => {
        sandbox.stub(wrapper.vm, 'isFormValid').returns(true)
        wrapper.setData({
          form: { initialPreissuedAmount: '100.000000' },
        })

        wrapper.vm.submit()

        expect(wrapper.emitted('submit')).to.exist
        expect(wrapper.emitted('submit')[0]).to.deep.equal([wrapper.vm.form])
      })
    })

    describe('setConfirmationState', () => {
      it('calls showConfirmation and emitDisabledState methods', () => {
        sandbox.stub(wrapper.vm, 'showConfirmation')
        sandbox.stub(wrapper.vm, 'emitDisabledState')

        wrapper.vm.setConfirmationState()

        expect(wrapper.vm.showConfirmation).to.have.been.calledOnce
        expect(wrapper.vm.emitDisabledState).to.have.been.calledOnce
      })
    })

    describe('emitDisabledState', () => {
      it('emits update isDisabled property event with correct payload', () => {
        wrapper.vm.emitDisabledState()

        expect(wrapper.emitted('update:isDisabled')).to.exist
        expect(wrapper.emitted('update:isDisabled')[0])
          .to.deep.equal([true])
      })
    })

    describe('emitEnabledState', () => {
      it('emits update isDisabled property event with correct payload', () => {
        wrapper.vm.emitEnabledState()

        expect(wrapper.emitted('update:isDisabled')).to.exist
        expect(wrapper.emitted('update:isDisabled')[0])
          .to.deep.equal([false])
      })
    })
  })
})
