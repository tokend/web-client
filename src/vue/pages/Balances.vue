<template>
  <div class="balances">
    <template v-if="isLoaded">
      <template v-if="assets.length">
        <assets-list :assets="assets" />
      </template>

      <template v-else>
        <no-data-message
          icon-name="trending-up"
          :title="'assets-page.no-balances-title' | globalize"
          :message="'assets-page.no-balances-msg' | globalize"
        />
      </template>
    </template>

    <template v-else-if="isLoadingFailed">
      <p>
        {{ 'assets-page.loading-error-msg' | globalize }}
      </p>
    </template>

    <template v-else>
      <loader message-id="assets-page.loading-msg" />
    </template>
  </div>
</template>

<script>
import AssetsList from '@/vue/common/assets/AssetsList'
import Loader from '@/vue/common/Loader'
import NoDataMessage from '@/vue/common/NoDataMessage'

import { ErrorHandler } from '@/js/helpers/error-handler'

import { mapGetters, mapActions } from 'vuex'
import { vuexTypes } from '@/vuex'

export default {
  name: 'balances',
  components: {
    AssetsList,
    Loader,
    NoDataMessage,
  },

  data: _ => ({
    assets: [],
    isLoaded: false,
    isLoadingFailed: false,
  }),

  computed: {
    ...mapGetters({
      accountBalances: vuexTypes.accountBalances,
    }),
  },

  async created () {
    try {
      await this.loadBalances()
      this.assets = this.accountBalances
        .map(balance => balance.assetDetails)
      this.isLoaded = true
    } catch (e) {
      this.isLoadingFailed = true
      ErrorHandler.processWithoutFeedback(e)
    }
  },

  methods: {
    ...mapActions({
      loadBalances: vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS,
    }),
  },
}
</script>

<style lang="scss" scoped>

</style>
