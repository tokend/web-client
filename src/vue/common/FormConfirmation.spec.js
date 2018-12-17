import FormConfirmation from './FormConfirmation'

import { TestHelper } from '@/test/test-helper'
import { mount, createLocalVue } from '@vue/test-utils'

import { globalize } from '@/vue/filters/globalize'

const localVue = createLocalVue()

localVue.filter('globalize', globalize)

describe('FormConfirmation component test', () => {
  it('template properly renders the data provided through props', () => {
    TestHelper.useTranslations({
      'form-confirmation': {
        'message-text-custom': 'Please ensure everything is OK!',
        'button-text-ok-custom': 'I\'m okay, let\'s go!',
        'button-text-cancel-custom': '!WOWO, wait please'
      }
    })

    const wrapper = mount(FormConfirmation, {
      propsData: {
        messageId: 'form-confirmation.message-text-custom',
        okButtonTextId: 'form-confirmation.button-text-ok-custom',
        cancelButtonTextId: 'form-confirmation.button-text-cancel-custom'
      },
      localVue
    })

    const renderedMessage = wrapper
      .find('.form-confirmation__msg')
      .text()
    const renderedOkButtonText = wrapper
      .find('.form-confirmation__ok-btn')
      .text()
    const renderedCancelButtonText = wrapper
      .find('.form-confirmation__cancel-btn')
      .text()

    expect(renderedMessage).to.equal('Please ensure everything is OK!')
    expect(renderedOkButtonText).to.equal('I\'m okay, let\'s go!')
    expect(renderedCancelButtonText).to.equal('!WOWO, wait please')
  })

  it('properly renders the default data if no props provided', () => {
    TestHelper.useTranslations({
      'form-confirmation': {
        'message-text-default': 'Please recheck the form before confirmation',
        'button-text-ok': 'Confirm',
        'button-text-cancel': 'Cancel'
      }
    })

    const wrapper = mount(FormConfirmation, {
      localVue
    })

    const renderedMessage = wrapper
      .find('.form-confirmation__msg')
      .text()
    const renderedOkButtonText = wrapper
      .find('.form-confirmation__ok-btn')
      .text()
    const renderedCancelButtonText = wrapper
      .find('.form-confirmation__cancel-btn')
      .text()

    expect(renderedMessage).to.equal('Please recheck the form before confirmation')
    expect(renderedOkButtonText).to.equal('Confirm')
    expect(renderedCancelButtonText).to.equal('Cancel')
  })

  it('template disables the OK and cancel buttons if isPending is true', () => {
    const wrapper = mount(FormConfirmation, {
      propsData: { isPending: true },
      localVue
    })
    const okBtn = wrapper.find('.form-confirmation__ok-btn')
    const cancelBtn = wrapper.find('.form-confirmation__cancel-btn')

    expect(okBtn.attributes('disabled')).to.equal('disabled')
    expect(cancelBtn.attributes('disabled')).to.equal('disabled')
  })

  it('template enables the OK and cancel buttons if isPending is false', () => {
    const wrapper = mount(FormConfirmation, {
      propsData: { isPending: false },
      localVue
    })
    const okBtn = wrapper.find('.form-confirmation__ok-btn')
    const cancelBtn = wrapper.find('.form-confirmation__cancel-btn')

    expect(okBtn.attributes('disabled')).to.be.undefined
    expect(cancelBtn.attributes('disabled')).to.be.undefined
  })

  it('component emits the passed okEvent when clicking the OK button', () => {
    const okEvent = 'ok-event'
    const wrapper = mount(FormConfirmation, {
      propsData: { okEvent },
      localVue
    })

    wrapper
      .find('.form-confirmation__ok-btn')
      .trigger('click')

    expect(wrapper.emitted()[okEvent]).to.exist
  })

  it('component emits the passed cancelEvent when clicking the cancel button', () => {
    const cancelEvent = 'cancel-event'
    const wrapper = mount(FormConfirmation, {
      propsData: { cancelEvent },
      localVue
    })

    wrapper
      .find('.form-confirmation__cancel-btn')
      .trigger('click')

    expect(wrapper.emitted()[cancelEvent]).to.exist
  })
})
