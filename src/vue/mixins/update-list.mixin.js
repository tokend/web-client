import { Bus } from '@/js/helpers/event-bus'

const DELAY_REFRESH_LIST_MS = 5000

export default {
  methods: {
    updateList () {
      setTimeout(() => {
        Bus.emit('updateList')
      }, DELAY_REFRESH_LIST_MS)
    },

    listenUpdateList (cb) {
      Bus.on('updateList', async () => {
        await cb()
      })
    },
  },
}
