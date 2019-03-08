<template>
  <div class="assets-explorer">
    <template v-if="isLoaded">
      <template v-if="assets.length">
        <assets-list :assets="assets" />
      </template>

      <template v-else>
        <no-data-message
          icon-name="trending-up"
          title-id="assets-page.no-assets-title"
          message-id="assets-page.no-assets-msg"
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

import { Sdk } from '@/sdk'

import { ErrorHandler } from '@/js/helpers/error-handler'

import { mapActions } from 'vuex'
import { vuexTypes } from '@/vuex'

export default {
  name: 'assets-explorer',
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

  async created () {
    try {
      await this.loadBalances()
      await this.loadAssets()
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

    async loadAssets () {
      const { data } = await Sdk.horizon.assets.getAll()
      this.assets = data
    },
  },
}
</script>

<style lang="scss" scoped>

</style>
