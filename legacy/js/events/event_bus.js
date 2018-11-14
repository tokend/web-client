import Vue from 'vue'

export class BusWrapper extends Vue {
  constructor () {
    super()
    this._backlog = {}
  }

  backlog (event) {
    this._backlog[event.type] = event
    return this._backlog[event.type]
  }

  getBacklogged (eventType) {
    return this._backlog[eventType] || null
  }

  handlerExists (event) {
    return !!this._events[event.type]
  }
}

const Bus = new BusWrapper()

export default Bus
