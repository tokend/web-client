export function eventHandlerTest (wrapper, handlingEvent, eventData) {
  return wrapper.emitted()[handlingEvent] &&
    wrapper.emitted()[handlingEvent].length === 1 &&
    wrapper.emitted()[handlingEvent][0][0] === eventData
}
