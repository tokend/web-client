import { Bus } from '@/js/helpers/event-bus'

export default {
  methods: {
    resetUpdateListEvent (event) {
      Bus.resetEvent(event)
    },

    emitUpdateList (event) {
      Bus.emit(event)
    },

    listenUpdateList (event, cb) {
      Bus.on(event, () => {
        cb()
      })
    },
  },
}
