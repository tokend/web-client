import isEqual from 'lodash/isEqual'
export class TestHelper {
  isEmittedOnce (wrapper, handlingEvent, eventData) {
    return wrapper.emitted()[handlingEvent] &&
      wrapper.emitted()[handlingEvent].length === 1 &&
      isEqual(wrapper.emitted()[handlingEvent][0][0], eventData)
  }
}
export const Helper = new TestHelper()
