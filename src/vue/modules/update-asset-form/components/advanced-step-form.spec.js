import AdvancedStepForm from './advanced-step-form'

import { createLocalVue, shallowMount } from '@vue/test-utils'

const localVue = createLocalVue()

describe('Advanced step form', () => {
  let sandbox

  beforeEach(() => {
    sandbox = sinon.createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('created hook', () => {
    it('calls populateForm only if record was passed as a prop', () => {
      sandbox.stub(AdvancedStepForm.methods, 'populateForm')

      shallowMount(AdvancedStepForm, { localVue })
      expect(AdvancedStepForm.methods.populateForm)
        .to.have.not.been.called

      shallowMount(AdvancedStepForm, {
        localVue,
        propsData: {
          record: { code: 'USD' },
        },
      })
      expect(AdvancedStepForm.methods.populateForm)
        .to.have.been.calledOnce
    })
  })
})
