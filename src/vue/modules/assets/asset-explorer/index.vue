<template>
  <div class="asset-explorer">
    <template v-if="isLoaded">
      <assets-renderer
        :storage-url="storageUrl"
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

import { mapGetters, mapActions, mapMutations } from 'vuex'
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
    storageUrl: {
      type: String,
      required: true,
    },
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
  computed: {
    ...mapGetters([
      vuexTypes.wallet,
    ]),
  },

  async created () {
    this.setAccountId(this.wallet.accountId)
    await this.load()
  },

  methods: {
    ...mapMutations('asset-explorer', {
      setAccountId: types.SET_ACCOUNT_ID,
    }),

    ...mapActions('asset-explorer', {
      loadAccountBalances: types.LOAD_ACCOUNT_BALANCES,
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
