import { EventDispatcher } from '../../../js/events/event_dispatcher'

export default {
  data () {
    return {
      isButtonDisabled: false,
      isPending: false
    }
  },
  methods: {
    disable () {
      this.isButtonDisabled = true
      this.isPending = true
      EventDispatcher.dispatchShowLoaderEvent()
      return Promise.resolve(true)
    },
    enable () {
      this.isButtonDisabled = false
      this.isPending = false
      EventDispatcher.dispatchHideLoaderEvent()
      return Promise.resolve(true)
    },
    disableLong () {
      this.isPending = true
      this.isButtonDisabled = true
      EventDispatcher.dispatchShowLoaderEvent()
      return Promise.resolve(true)
    }
  }
}
