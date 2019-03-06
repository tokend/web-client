<template>
  <div class="healthcare-page">
    <top-bar>
      <template slot="extra">
        <button
          v-ripple
          class="app__button-raised"
          @click="isIssuanceDrawerShown = true"
        >
          {{ 'healthcare-page.create-document' | globalize }}
        </button>
      </template>
    </top-bar>
  </div>
</template>

<script>
import TopBar from '@/vue/common/TopBar'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

import config from '@/config'

export default {
  name: 'healthcare-page',
  components: {
    TopBar,
  },

  data: _ => ({
    config: {
      horizonURL: config.HORIZON_SERVER,
    },
  }),

  computed: {
    ...mapGetters({
      wallet: vuexTypes.wallet,
    }),
  },
}
</script>

<style lang="scss" scoped>

</style>
