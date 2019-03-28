import { EventBus } from '@/js/helpers/event-bus'

class LocalBus extends EventBus {
  onSignersUpdate (handlerFn) {
    this.on(this.eventList.signersUpdate, handlerFn)
  }

  emitSignersUpdate () {
    this.emit(this.eventList.signersUpdate)
  }

  get eventList () {
    return {
      signersUpdate: 'signer-update',
    }
  }
}

export const Bus = new LocalBus()
