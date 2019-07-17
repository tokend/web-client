import { Bus } from '@/js/helpers/event-bus'

const DELAY_REFRESH_LIST_MS = 5000

export default {
  methods: {
    resetUpdateListEvent (event) {
      Bus.resetEvent(event)
    },

    emitUpdateList (event) {
      setTimeout(() => {
        Bus.emit(event)
      }, DELAY_REFRESH_LIST_MS)
    },

    listenUpdateList (event, cb) {
      Bus.on(event, () => {
        cb()
      })
    },
  },
}
