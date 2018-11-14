import { commonEvents } from '../../../js/events/common_events'
import { dispatchAppEvent } from '../../../js/events/helpers'

export default {
  data: () => ({
    routes: []
  }),

  created () {
    dispatchAppEvent(commonEvents.routesUpdateEvent, this.routes)
  }
}
