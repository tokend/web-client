import ShortBlurbStepForm from './short-blurb-step-form'

import Vuelidate from 'vuelidate'

import { createLocalVue, mount, shallowMount } from '@vue/test-utils'

const localVue = createLocalVue()
localVue.use(Vuelidate)

describe('Short blurb step form', () => {
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
      wrapper = mount(ShortBlurbStepForm, { localVue })
    })

    const expectedResults = {
      saleLogo: ['required'],
      shortDescription: ['required', 'maxLength'],
    }

    for (const [model, rules] of Object.entries(expectedResults)) {
      it(`${model} model is validating by proper set of rules`, () => {
        expect(Object.keys(wrapper.vm.$v.form[model].$params))
          .to.deep.equal(rules)
      })
    }
  })

  describe('created hook', () => {
    it('calls populateForm only if request was passed as a prop', () => {
      sandbox.stub(ShortBlurbStepForm.methods, 'populateForm')

      shallowMount(ShortBlurbStepForm, { localVue })
      expect(ShortBlurbStepForm.methods.populateForm)
        .to.have.not.been.called

      shallowMount(ShortBlurbStepForm, {
        localVue,
        propsData: { request: { id: '1' } },
      })
      expect(ShortBlurbStepForm.methods.populateForm)
        .to.have.been.calledOnce
    })
  })

  describe('component', () => {
    let wrapper

    beforeEach(() => {
      wrapper = shallowMount(ShortBlurbStepForm, { localVue })
    })

    describe('method', () => {
      describe('populateForm', () => {
        it('properly sets request prop fields to form property', () => {
          wrapper.setProps({
            request: {
              shortDescription: 'Some description',
            },
          })

          wrapper.vm.populateForm()

          expect(wrapper.vm.form.shortDescription)
            .to.equal('Some description')
        })
      })

      describe('submit', () => {
        it('emits submit event with correct payload', () => {
          sandbox.stub(wrapper.vm, 'isFormValid').returns(true)
          wrapper.setData({
            form: { shortDescription: 'Some description' },
          })

          wrapper.vm.submit()

          expect(wrapper.emitted('submit')).to.exist
          expect(wrapper.emitted('submit')[0])
            .to.deep.equal([wrapper.vm.form])
        })
      })
    })
  })
})
