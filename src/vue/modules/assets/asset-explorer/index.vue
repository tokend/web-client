<template>
  <div class="asset-explorer">
    <template v-if="isLoaded">
      <assets-renderer
        :is-account-unverified="isAccountUnverified"
        :is-account-us-accredited="isAccountUsAccredited"
        :is-account-us-verified="isAccountUsVerified"
        :is-account-general="isAccountGeneral"
        :is-account-corporate="isAccountCorporate"
      />
    </template>

    <template v-else-if="isLoadFailed">
      <p class="asset-explorer__error-msg">
        {{ 'assets.loading-error-msg' | globalize }}
      </p>
    </template>

    <template v-else>
      <load-spinner message-id="assets.balances-loading-msg" />
    </template>
  </div>
</template>

<script>
import LoadSpinner from '@/vue/common/Loader'

import AssetsRenderer from './components/assets-renderer'

import { mapActions } from 'vuex'
import { types } from './store/types'
import { vuexTypes } from '@/vuex'

import { ErrorHandler } from '@/js/helpers/error-handler'

export default {
  name: 'asset-explorer',
  components: {
    LoadSpinner,
    AssetsRenderer,
  },

  props: {
    isAccountUnverified: {
      type: Boolean,
      required: true,
    },
    isAccountUsAccredited: {
      type: Boolean,
      required: true,
    },
    isAccountUsVerified: {
      type: Boolean,
      required: true,
    },
    isAccountGeneral: {
      type: Boolean,
      required: true,
    },
    isAccountCorporate: {
      type: Boolean,
      required: true,
    },
  },

  data: _ => ({
    isLoaded: false,
    isLoadFailed: false,
  }),

  async created () {
    await this.load()
  },

  methods: {
    ...mapActions({
      loadAccountBalances: vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS,
    }),
    ...mapActions('asset-explorer', {
      loadKycRequiredAssetType: types.LOAD_KYC_REQUIRED_ASSET_TYPE,
      loadSecurityAssetType: types.LOAD_SECURITY_ASSET_TYPE,
    }),

    async load () {
      try {
        await this.loadAccountBalances()
        await this.loadKycRequiredAssetType()
        await this.loadSecurityAssetType()
        this.isLoaded = true
      } catch (e) {
        this.isLoadFailed = true
        ErrorHandler.processWithoutFeedback()
      }
    },
  },
}
</script>
