import StatusMessage from './StatusMessage'

import { Bus } from '@/js/helpers/event-bus'
import { globalize } from '@/vue/filters/globalize'
import { TestHelper } from '@/test/test-helper'
import { mount, createLocalVue } from '@vue/test-utils'

const localVue = createLocalVue()

localVue.filter('globalize', globalize)

describe('StatusMessage component test', () => {
  describe('shows correctly styled depending on event type', () => {
    const expectedResults = {
      [Bus.eventList.warning]: 'status-message--warning',
      [Bus.eventList.success]: 'status-message--success',
      [Bus.eventList.error]: 'status-message--error',
      [Bus.eventList.info]: 'status-message--info',
    }

    for (const [eventName, className] of Object.entries(expectedResults)) {
      it(`${eventName} event`, () => {
        const wrapper = mount(StatusMessage, { localVue })
        Bus.emit(eventName)
        const element = wrapper.find('.status-message')

        expect(element.classes(className)).to.be.true
      })
    }
  })

  describe('renders the proper labels for the close button', () => {
    before(() => {
      TestHelper.useTranslations({
        'status-message': {
          'close-lbl_warning': 'Warning label',
          'close-lbl_success': 'Success label',
          'close-lbl_error': 'Error label',
          'close-lbl_info': 'Info label',
        },
      })
    })

    after(() => {
      TestHelper.resetTranslations()
    })

    const expectedResults = {
      [Bus.eventList.warning]: 'Warning label',
      [Bus.eventList.success]: 'Success label',
      [Bus.eventList.error]: 'Error label',
      [Bus.eventList.info]: 'Info label',
    }

    for (const [eventName, label] of Object.entries(expectedResults)) {
      it(`${eventName} event`, () => {
        const wrapper = mount(StatusMessage, { localVue })
        Bus.emit(eventName)
        const button = wrapper.find('.status-message__btn')

        expect(button.text()).to.equal(label)
      })
    }
  })

  describe('renders the message passed to the emitted event', () => {
    before(() => {
      TestHelper.useTranslations({
        'messages': {
          'warning': 'Warning message',
          'success': 'Success message',
          'error': 'Error message',
          'info': 'Info message',
        },
      })
    })

    after(() => {
      TestHelper.resetTranslations()
    })

    const expectedResults = {
      [Bus.eventList.warning]: {
        id: 'messages.warning',
        translation: 'Warning message',
      },
      [Bus.eventList.success]: {
        id: 'messages.success',
        translation: 'Success message',
      },
      [Bus.eventList.error]: {
        id: 'messages.error',
        translation: 'Error message',
      },
      [Bus.eventList.info]: {
        id: 'messages.info',
        translation: 'Info message',
      },
    }

    for (const [eventName, message] of Object.entries(expectedResults)) {
      it(`${eventName} event`, () => {
        const wrapper = mount(StatusMessage, { localVue })
        Bus.emit(eventName, message.id)
        const paragraph = wrapper.find('.status-message__content')

        expect(paragraph.text()).to.equal(message.translation)
      })
    }
  })

  describe('renders default messages when nothing passed to the emitted event', () => {
    before(() => {
      TestHelper.useTranslations({
        'status-message': {
          'default-message_warning': 'Default warning message',
          'default-message_success': 'Default success message',
          'default-message_error': 'Default error message',
          'default-message_info': 'Default info message',
        },
      })
    })

    after(() => {
      TestHelper.resetTranslations()
    })

    const expectedResults = {
      [Bus.eventList.warning]: 'Default warning message',
      [Bus.eventList.success]: 'Default success message',
      [Bus.eventList.error]: 'Default error message',
      [Bus.eventList.info]: 'Default info message',
    }

    for (const [eventName, message] of Object.entries(expectedResults)) {
      it(`${eventName} event`, () => {
        const wrapper = mount(StatusMessage, { localVue })
        Bus.emit(eventName)
        const paragraph = wrapper.find('.status-message__content')

        expect(paragraph.text()).to.equal(message)
      })
    }
  })
})
