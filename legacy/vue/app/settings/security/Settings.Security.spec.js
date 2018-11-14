import { mount, localVue } from '@vue/test-utils'

import Vue from 'vue'
import VueMaterial from 'vue-material'
import VeeValidate from 'vee-validate'

import Security from './Settings.Security'
import TfaSettings from './Security.TfaSettings'
import ChangePassword from './Security.ChangePassword'

Vue.use(VueMaterial)
Vue.use(VeeValidate)

describe ('Settings.Security component', () => {
  let SecurityComponentWrapper
  beforeEach(() => {
    SecurityComponentWrapper = mount(Security)
  })

  it('Contains TfaSettings component', () => {
    expect(SecurityComponentWrapper.contains(TfaSettings)).to.equal(true)
  })

  it('Contains ChangePassword component', () => {
    expect(SecurityComponentWrapper.contains(ChangePassword)).to.equal(true)
  })
})
