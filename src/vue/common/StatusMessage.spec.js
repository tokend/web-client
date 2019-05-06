import StatusMessage from './StatusMessage'

import { Bus } from '@/js/helpers/event-bus'
import { mount, createLocalVue } from '@vue/test-utils'

const localVue = createLocalVue()

describe('StatusMessage component test', () => {
  describe('is being applied correct styles depending on event type', () => {
    const expectedResults = {
      [Bus.eventList.warning]: 'status-message--warning',
      [Bus.eventList.success]: 'status-message--success',
      [Bus.eventList.error]: 'status-message--error',
      [Bus.eventList.info]: 'status-message--info',
    }

    for (const [eventName, className] of Object.entries(expectedResults)) {
      it(`${eventName} event`, async () => {
        const wrapper = mount(StatusMessage, { localVue })

        Bus.emit(eventName)
        await localVue.nextTick()

        const element = wrapper.find('.status-message')
        expect(element.classes(className), className).to.be.true
      })
    }
  })

  describe('renders proper titles', () => {
    let veryLocalVue
    before(() => {
      const globalizeStub = sinon.stub()
      globalizeStub
        .withArgs('status-message.title', { context: 'warning' })
        .returns('Warning title')
        .withArgs('status-message.title', { context: 'success' })
        .returns('Success title')
        .withArgs('status-message.title', { context: 'error' })
        .returns('Error title')
        .withArgs('status-message.title', { context: 'info' })
        .returns('Info title')
      veryLocalVue = createLocalVue()
      veryLocalVue.filter('globalize', globalizeStub)
    })

    const expectedResults = {
      [Bus.eventList.warning]: 'Warning title',
      [Bus.eventList.success]: 'Success title',
      [Bus.eventList.error]: 'Error title',
      [Bus.eventList.info]: 'Info title',
    }

    for (const [eventName, title] of Object.entries(expectedResults)) {
      it(`${eventName} event`, async () => {
        const wrapper = mount(StatusMessage, { localVue: veryLocalVue })
        Bus.emit(eventName)
        await localVue.nextTick()
        const titleEl = wrapper.find('.status-message__title')

        expect(titleEl.text()).to.equal(title)
      })
    }
  })

  // TODO: add event message rendering tests
})
