<template>
  <div id="app" v-if="isAppInitialized">
    <warning-banner
      v-if="isNotSupportedBrowser"
      :message="'common.browser-not-supported' | globalize"
    />

    <template v-if="isLoggedIn && isNavigationRendered">
      <warning-banner
        v-if="isAccountBlocked"
        :message="'warning-banner.blocked-desc' | globalize({
          reason: kycRequestBlockReason
        })"
        message-type="danger"
      />
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
import WarningBanner from '@/vue/common/WarningBanner'
import IdleHandlerMixin from '@/vue/mixins/idle-handler'

import {
  mapGetters,
  mapActions,
} from 'vuex'
import { Sdk } from '@/sdk'
import { initApi, api } from '@/api'
import { vuexTypes } from '@/vuex'
import { Wallet } from '@tokend/js-sdk'

import config from '@/config'

export default {
  name: 'app',

  components: {
    Navbar,
    Sidebar,
    StatusMessage,
    WarningBanner,
  },

  mixins: [IdleHandlerMixin],

  data: () => ({
    isNotSupportedBrowser: false,
    isAppInitialized: false,
  }),

  computed: {
    ...mapGetters([
      vuexTypes.walletEmail,
      vuexTypes.walletSeed,
      vuexTypes.walletAccountId,
      vuexTypes.walletId,
      vuexTypes.isAccountBlocked,
      vuexTypes.kycRequestBlockReason,
    ]),
    isNavigationRendered () {
      return this.$route.matched.some(m => m.meta.isNavigationRendered)
    },
  },

  async created () {
    await this.initApp()

    this.detectIE()

    this.isAppInitialized = true
  },

  methods: {
    ...mapActions({
      loadKvEntries: vuexTypes.LOAD_KV_ENTRIES,
      loadDefaultQuoteAsset: vuexTypes.LOAD_DEFAULT_QUOTE_ASSET,
    }),
    async initApp () {
      await Sdk.init(config.HORIZON_SERVER)
      initApi(null, config.HORIZON_SERVER)
      await this.loadKvEntries()
      await this.loadDefaultQuoteAsset()

      if (this[vuexTypes.isLoggedIn]) {
        const wallet = new Wallet(
          this.walletEmail,
          this.walletSeed,
          this.walletAccountId,
          this.walletId
        )
        Sdk.sdk.useWallet(wallet)
        api().useWallet(wallet)
      }
    },
    detectIE () {
      const edge = window.navigator.userAgent.indexOf('Edge/')

      if (edge > 0) this.isNotSupportedBrowser = true
    },
  },
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
  min-height: 6.4rem;
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
  padding: $content-padding-top $content-padding-right
    $content-padding-bottom $content-padding-left;
  background-color: $col-app-content-background;

  @include respond-to-custom($sidebar-hide-bp) {
    width: 100vw;
    padding: 0 $content-side-paddings-sm 3rem;
  }
}
</style>
