<template>
  <div id="app" v-if="isAppInitialized">
    <warning-banner
      v-if="isNotSupportedBrowser"
      :message-id="'common.browser-not-supported'"
    />

    <template v-if="isLoggedIn">
      <div class="app__container">
        <sidebar />

        <div class="app__main-content">
          <div class="app__navbar">
            <navbar />
          </div>

          <div class="app__main">
            <router-view />
          </div>
        </div>
      </div>
    </template>

    <template v-else>
      <router-view />
    </template>

    <status-message />
  </div>
</template>

<script>
import StatusMessage from '@/vue/common/StatusMessage'
import Navbar from '@/vue/navigation/Navbar.vue'
import Sidebar from '@/vue/navigation/Sidebar.vue'

import {
  mapGetters
} from 'vuex'
import { Sdk } from '@/sdk'
import { Wallet } from '@tokend/js-sdk'
import { vuexTypes } from '@/vuex'
import { vueRoutes } from '@/vue-router'

import config from '@/config'

export default {
  name: 'app',

  components: {
    Navbar,
    Sidebar,
    StatusMessage
  },

  data: () => ({
    isNotSupportedBrowser: false,
    isAppInitialized: false
  }),

  computed: {
    ...mapGetters([
      vuexTypes.wallet,
      vuexTypes.isLoggedIn
    ])
  },

  async created () {
    await this.initApp()

    window.setTimeout(() => {
      this.$store.commit(vuexTypes.KEEP_SESSION)
    }, 1000)

    this.detectIE()
    this.waitLogout()

    this.isAppInitialized = true
  },

  methods: {
    async initApp () {
      await Sdk.init(config.HORIZON_SERVER)
      if (this[vuexTypes.isLoggedIn]) {
        Sdk
          .sdk
          .useWallet(new Wallet(
            '',
            this[vuexTypes.wallet].secretSeed,
            this[vuexTypes.wallet].accountId,
            this[vuexTypes.wallet].id
          ))
      }
    },
    detectIE () {
      const edge = window.navigator.userAgent.indexOf('Edge/')

      if (edge > 0) this.isNotSupportedBrowser = true
    },
    waitLogout () {
      this.$store.subscribe(mutation => {
        switch (mutation.type) {
          case vuexTypes.CLEAR_STATE:
            this.$router.push(vueRoutes.login)
            break
        }
      })
    }
  }
}
</script>

<style lang="scss">
@import "~@scss/mixins";
@import "~@scss/variables";

.app__container {
  display: flex;
  align-items: stretch;
  overflow-x: hidden;
  flex: 1;
}

.app__main-content {
  flex: 1;
  overflow: hidden;
}

.app__navbar {
  position: relative;
  z-index: 4;
  min-height: 64px;
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: space-between;
  transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transition-property: opacity, background-color, box-shadow, transform, color,
    min-height, -webkit-transform;
  will-change: opacity, background-color, box-shadow, transform, color,
    min-height;
}

.app__main {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 4rem $content-side-paddings;
  background-color: $col-app-content-background;

  @include respond-to-custom($sidebar-hide-bp) {
    width: 100vw;
    padding: 0 $content-side-paddings-sm;
  }
}
</style>
