
import { api } from '@/api'

export default {
  data: _ => ({
    restrictedPollType: null,
  }),

  methods: {
    async loadRestrictedPollType () {
      const endpoint = '/v3/key_values/poll_type:restricted'
      const { data } = await api.get(endpoint)
      this.restrictedPollType = data.value.u32
    },
  },
}
