<template>
  <div />
</template>

<script>
import { vuexTypes } from '@/vuex'
import { mapMutations } from 'vuex'

export default {
  name: 'idle-check',

  onIdle () {
    this.clearState()
    this.$router.push({
      name: this.$route.name,
      query: { isIdle: 'true' },
    })
    location.reload()
  },

  methods: {
    ...mapMutations({
      clearState: vuexTypes.CLEAR_STATE,
    }),
  },
}
</script>
