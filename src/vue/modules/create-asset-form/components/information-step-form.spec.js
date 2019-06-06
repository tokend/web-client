import InformationStepForm from './information-step-form'

import Vuelidate from 'vuelidate'

import { createLocalVue, mount, shallowMount } from '@vue/test-utils'

const localVue = createLocalVue()
localVue.use(Vuelidate)

describe('Information step form', () => {
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
      wrapper = mount(InformationStepForm, { localVue })
    })

    const expectedResults = {
      name: ['required', 'maxLength'],
      code: ['required', 'assetCode'],
      maxIssuanceAmount: ['required', 'amountRange'],
      assetType: ['required'],
    }

    for (const [model, rules] of Object.entries(expectedResults)) {
      it(`${model} model is validating by proper set of rules`, () => {
        expect(Object.keys(wrapper.vm.$v.form[model].$params))
          .to.deep.equal(rules)
      })
    }

    const fieldBindings = {
      '[name=create-asset-name]': 'name',
      '[name=create-asset-code]': 'code',
      '[name=create-asset-max-issuance-amount]': 'maxIssuanceAmount',
      '[name=create-asset-type]': 'assetType',
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
      sandbox.stub(InformationStepForm.methods, 'populateForm')

      shallowMount(InformationStepForm, { localVue })
      expect(InformationStepForm.methods.populateForm)
        .to.have.not.been.called

      shallowMount(InformationStepForm, {
        localVue,
        propsData: {
          request: { id: '1' },
        },
      })
      expect(InformationStepForm.methods.populateForm)
        .to.have.been.calledOnce
    })
  })

  describe('component', () => {
    let wrapper

    beforeEach(() => {
      wrapper = shallowMount(InformationStepForm, { localVue })
    })

    describe('populateForm', () => {
      it('properly sets request prop fields to form property', () => {
        wrapper.setProps({
          request: {
            assetName: 'American dollar',
            assetCode: 'USD',
            maxIssuanceAmount: '1000.000000',
            policy: 16,
          },
        })

        wrapper.vm.populateForm()

        expect(wrapper.vm.form.name).to.equal('American dollar')
        expect(wrapper.vm.form.code).to.equal('USD')
        expect(wrapper.vm.form.maxIssuanceAmount).to.equal('1000.000000')
        expect(wrapper.vm.form.policies).to.equal(16)
      })
    })

    describe('submit', () => {
      it('emits submit event with correct payload', () => {
        sandbox.stub(wrapper.vm, 'isFormValid').returns(true)
        wrapper.setData({
          form: { code: 'USD' },
        })

        wrapper.vm.submit()

        expect(wrapper.emitted('submit')).to.exist
        expect(wrapper.emitted('submit')[0])
          .to.deep.equal([wrapper.vm.form])
      })
    })
  })
})
