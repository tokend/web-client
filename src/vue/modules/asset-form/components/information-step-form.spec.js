import InformationStepForm from './information-step-form'

import Vuelidate from 'vuelidate'

import { createLocalVue, mount, shallowMount } from '@vue/test-utils'
import { AssetFormer } from '@/js/formers/AssetFormer'

const localVue = createLocalVue()
localVue.use(Vuelidate)
localVue.filter('globalize', sinon.stub())
localVue.directive('ripple', sinon.stub())

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
      wrapper = mount(InformationStepForm, {
        localVue,
        propsData: { former: new AssetFormer('create') },
      })
    })

    const expectedResults = {
      name: ['required', 'maxLength'],
      code: ['required', 'assetCode'],
    }

    for (const [model, rules] of Object.entries(expectedResults)) {
      it(`${model} is validating by proper set of rules`, () => {
        expect(Object.keys(wrapper.vm.$v.form[model].$params))
          .to.deep.equal(rules)
      })
    }

    const fieldBindings = {
      '[name=create-asset-name]': 'name',
      '[name=create-asset-code]': 'code',
    }

    for (const [selector, model] of Object.entries(fieldBindings)) {
      it(`$v.form.${model} is touched after blur event emitted on ${selector}`, () => {
        sandbox.stub(wrapper.vm, 'touchField')

        wrapper.find(selector).vm.$emit('blur')

        expect(wrapper.vm.touchField.calledOnce).to.be.true
      })
    }
  })

  describe('component', () => {
    let wrapper

    beforeEach(() => {
      wrapper = shallowMount(InformationStepForm, {
        localVue,
        propsData: { former: new AssetFormer() },
      })
    })

    describe('next', () => {
      it('emits next event with correct payload', () => {
        sandbox.stub(wrapper.vm, 'isFormValid').returns(true)
        sandbox.stub(wrapper.vm.former, 'mergeAttrs')
        wrapper.setData({ form: { code: 'USD' } })

        wrapper.vm.next()

        expect(wrapper.vm.former.mergeAttrs).to.have.been.calledWithMatch({ code: 'USD' })
        expect(wrapper.emitted('next')).to.exist
      })
    })
  })
})
