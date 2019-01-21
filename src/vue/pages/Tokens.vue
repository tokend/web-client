<template>
  <div>
    <top-bar>
      <template slot="main">
        <router-link
          v-ripple
          :to="vueRoutes.tokensExplore"
        >
          <span>{{ 'tokens-page.explore-title' | globalize }}</span>
        </router-link>
        <router-link
          v-ripple
          :to="vueRoutes.balances"
        >
          <span>{{ 'tokens-page.balances-title' | globalize }}</span>
        </router-link>
      </template>
      <template
        v-if="account.accountTypeI === ACCOUNT_TYPES.syndicate"
        slot="extra"
      >
        <button
          v-ripple
          class="create-token-btn"
          @click="isTokenDrawerShown = true"
        >
          {{ 'tokens-page.create-token-btn' | globalize }}
        </button>
      </template>
    </top-bar>
    <drawer :is-shown.sync="isTokenDrawerShown">
      <template slot="heading">
        {{ 'tokens-page.create-token-btn' | globalize }}
      </template>
      <token-form />
    </drawer>
    <router-view />
  </div>
</template>

<script>
import TopBar from '@/vue/common/TopBar'
import Drawer from '@/vue/common/Drawer'
import TokenForm from '@/vue/forms/TokenForm'

import { ACCOUNT_TYPES } from '@tokend/js-sdk'

import { vueRoutes } from '@/vue-router/routes'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

export default {
  name: 'tokens',
  components: {
    TopBar,
    Drawer,
    TokenForm,
  },
  data: _ => ({
    ACCOUNT_TYPES,
    vueRoutes,
    isTokenDrawerShown: false,
  }),
  computed: {
    ...mapGetters({
      account: vuexTypes.account,
    }),
  },
}
</script>

<style lang="scss" scoped>
@import "~@scss/variables";
@import "~@scss/mixins";

.create-token-btn {
  @include button-raised;
}
</style>
