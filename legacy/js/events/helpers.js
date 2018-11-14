import Bus from './event_bus'
import { AppEvent } from './event_types'

export function dispatchAppEvent (event, payload) {
  validateEvent(event)
  event.payload = payload
  if (Bus.handlerExists(event)) {
    Bus.$emit(event.type, event.payload)
  } else {
    Bus.backlog(event)
  }
}

export function attachEventHandler (event, handler) {
  validateEvent(event)
  const backloggedEvent = Bus.getBacklogged(event.type)
  if (backloggedEvent) {
    handler(backloggedEvent.payload)
  }
  Bus.$on(event.type, handler)
}

function validateEvent (event) {
  if (!(event instanceof AppEvent)) {
    throw new Error(`Error. ${event} is not an instance of allowed events`)
  }
}
