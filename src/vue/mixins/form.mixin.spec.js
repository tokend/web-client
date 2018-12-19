import Vuelidate from 'vuelidate'
import FormMixin from './form.mixin'

import { required } from '@validators'

import {
  mount,
  createLocalVue
} from '@vue/test-utils'

const localVue = createLocalVue()

localVue.use(Vuelidate)

const Component = {
  template: `<div></div>`,
  data: _ => ({
    form: {
      firstName: '',
      lastName: ''
    }
  }),
  validations: {
    form: {
      firstName: { required },
      lastName: { required }
    }
  }
}

describe('form.mixin unit test', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(Component, {
      mixins: [FormMixin],
      localVue
    })
  })

  it('disable/enables methods correctly modify isDisabled ', () => {
    wrapper.vm._disableForm()
    expect(wrapper.vm._isDisabled).to.be.true

    wrapper.vm._enableForm()
    expect(wrapper.vm._isDisabled).to.be.false
  })

  it('isValid should define invalid form fields', () => {
    expect(wrapper.vm._isFormValid()).to.be.false

    wrapper.setData({
      form: {
        firstName: 'John',
        lastName: 'Doe'
      }
    })

    expect(wrapper.vm._isFormValid()).to.be.true
  })

  it('_touchField should modify dirty param for the validation model', () => {
    wrapper.vm._touchField('form.firstName')
    expect(wrapper.vm.$v.form.firstName.$dirty).to.be.true
    expect(wrapper.vm.$v.form.lastName.$dirty).to.be.false

    wrapper.vm._touchField('form.lastName')
    expect(wrapper.vm.$v.form.lastName.$dirty).to.be.true
  })
})
