import isEqual from 'lodash/isEqual'

export class TestHelper {
  static getError (constructor) {
    return new constructor({
      status: 0,
      response: {
        data: {
          errors: [{
            title: 'Error',
            detail: 'Mocked error',
          }],
        },
      },
    })
  }

  static isEmittedOnce (wrapper, handlingEvent, eventData) {
    return wrapper.emitted()[handlingEvent] &&
      wrapper.emitted()[handlingEvent].length === 1 &&
      isEqual(wrapper.emitted()[handlingEvent][0][0], eventData)
  }
}
