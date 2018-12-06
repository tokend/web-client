import FormConfirmation from './FormConfirmation'

import { TestHelper } from '@/test/test-helper'
import { mount } from '@vue/test-utils'

describe('FormConfirmation component test', () => {
  beforeEach(() => {
    TestHelper.useTranslations({
      'form-confirmation': {
        'message-text_default': 'Please recheck the form before confirmation',
        'button-text_ok': 'Confirm',
        'button-text_cancel': 'Cancel'
      }
    })
  })

  it('template properly renders the data provided through props', () => {
    const message = 'Please ensure everything is OK!'
    const okButtonText = 'I\'m okay, let\'s go!'
    const cancelButtonText = 'WOWO, wait please!'

    const wrapper = mount(FormConfirmation, {
      propsData: {
        message,
        okButtonText,
        cancelButtonText
      }
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

    expect(renderedMessage).to.equal(message)
    expect(renderedOkButtonText).to.equal(okButtonText)
    expect(renderedCancelButtonText).to.equal(cancelButtonText)
  })

  it('properly renders the default data if no props provided', () => {
    const message = 'Please recheck the form before confirmation'
    const okButtonText = 'Confirm'
    const cancelButtonText = 'Cancel'

    const wrapper = mount(FormConfirmation)

    const renderedMessage = wrapper
      .find('.form-confirmation__msg')
      .text()
    const renderedOkButtonText = wrapper
      .find('.form-confirmation__ok-btn')
      .text()
    const renderedCancelButtonText = wrapper
      .find('.form-confirmation__cancel-btn')
      .text()

    expect(renderedMessage).to.equal(message)
    expect(renderedOkButtonText).to.equal(okButtonText)
    expect(renderedCancelButtonText).to.equal(cancelButtonText)
  })

  it('template disables the OK and cancel buttons if isPending is true', () => {
    const wrapper = mount(FormConfirmation, {
      propsData: { isPending: true }
    })
    const okBtn = wrapper.find('.form-confirmation__ok-btn')
    const cancelBtn = wrapper.find('.form-confirmation__cancel-btn')

    expect(okBtn.attributes('disabled')).to.equal('disabled')
    expect(cancelBtn.attributes('disabled')).to.equal('disabled')
  })

  it('template enables the OK and cancel buttons if isPending is false', () => {
    const wrapper = mount(FormConfirmation, {
      propsData: { isPending: false }
    })
    const okBtn = wrapper.find('.form-confirmation__ok-btn')
    const cancelBtn = wrapper.find('.form-confirmation__cancel-btn')

    expect(okBtn.attributes('disabled')).to.be.undefined
    expect(cancelBtn.attributes('disabled')).to.be.undefined
  })

  it('component emits the passed okEvent when clicking the OK button', () => {
    const okEvent = 'ok-event'
    const wrapper = mount(FormConfirmation, {
      propsData: { okEvent }
    })

    wrapper
      .find('.form-confirmation__ok-btn')
      .trigger('click')

    expect(wrapper.emitted()[okEvent]).to.exist
  })

  it('component emits the passed cancelEvent when clicking the cancel button', () => {
    const cancelEvent = 'cancel-event'
    const wrapper = mount(FormConfirmation, {
      propsData: { cancelEvent }
    })

    wrapper
      .find('.form-confirmation__cancel-btn')
      .trigger('click')

    expect(wrapper.emitted()[cancelEvent]).to.exist
  })
})
