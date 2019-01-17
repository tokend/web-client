<template>
  <div>
    <top-bar>
      <template slot="main">
        <router-link
          v-ripple
          :to="{ name: 'app.verification' }"
        >
          <span>{{ verificationTabId | globalize }}</span>
        </router-link>
        <router-link
          v-ripple
          :to="{ name: 'app.security' }"
        >
          <span>{{ 'settings-page.security-tab' | globalize }}</span>
        </router-link>
      </template>
    </top-bar>
    <router-view />
  </div>
</template>

<script>
import TopBar from '@/vue/common/TopBar'

import { vuexTypes } from '@/vuex'
import { mapGetters } from 'vuex'

import { REQUEST_STATES_STR } from '@/js/const/request-states.const'

export default {
  name: 'settings',
  components: {
    TopBar,
  },
  computed: {
    ...mapGetters({
      kycState: vuexTypes.kycState,
    }),
    verificationTabId () {
      if (this.kycState === REQUEST_STATES_STR.approved) {
        return 'settings-page.my-account-tab'
      } else {
        return 'settings-page.verification-tab'
      }
    },
  },
}
</script>

<style lang="scss" scoped>

</style>
