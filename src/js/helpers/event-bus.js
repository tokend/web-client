import Vue from 'vue'
import log from 'loglevel'

export class EventBus extends Vue {
  constructor () {
    super()
    this._backlog = []
  }

  on (eventName, handlerFn) {
    if (!this.eventExists(eventName)) {
      throw new Error(`EventBus.list has no ${eventName} event`)
    }

    const backloggedEvents = this._backlog.filter(e => e.name === eventName)

    for (const [index, event] of backloggedEvents.entries()) {
      handlerFn(event.payload)
      this._backlog.splice(index, 1)
      log.debug(`Event ${eventName} is backlogged. Handling...`)
    }

    this.$on(eventName, handlerFn)
  }

  emit (eventName, payload) {
    if (!this.eventExists(eventName)) {
      throw new Error(`EventBus.list has no ${eventName} event`)
    }

    if (!this._events[eventName]) {
      this._backlog.push({
        name: eventName,
        payload,
      })

      log.debug(`Backlogging event: ${eventName}`)
      return
    }

    this.$emit(eventName, payload)
  }

  reset () {
    this.$off()
    this._backlog = []
  }

  success (payload) { this.emit(this.eventList.success, payload) }
  warning (payload) { this.emit(this.eventList.warning, payload) }
  error (payload) { this.emit(this.eventList.error, payload) }
  info (payload) { this.emit(this.eventList.info, payload) }

  get eventList () {
    return {
      success: 'success',
      warning: 'warning',
      error: 'error',
      info: 'info',
      updatePollRequests: 'polls:updateRequestsList',
    }
  }

  eventExists (eventName) {
    return Object
      .values(this.eventList)
      .includes(eventName)
  }
}

export const Bus = new EventBus()
