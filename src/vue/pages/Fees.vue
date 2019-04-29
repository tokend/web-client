<template>
  <div class="fees-renderer">
    <template v-if="isLoaded && assets.length">
      <top-bar>
        <template slot="main">
          <div class="fees-renderer__filter">
            <span class="fees-renderer__filter-prefix">
              {{ 'fees-page.asset-filter-prefix' | globalize }}
            </span>
            <select-field
              v-model="asset"
              :values="assets"
              key-as-value-text="nameAndCode"
              class="app__select app__select--no-border"
            />
          </div>
        </template>
      </top-bar>

      <submodule-importer
        v-if="asset.code && getModule().canRenderSubmodule(FeesModule)"
        :submodule="getModule().getSubmodule(FeesModule)"
        :asset-code="asset.code"
        :wallet="wallet"
        :config="config"
      />
    </template>

    <template v-else-if="isLoaded">
      <no-data-message
        icon-name="trending-up"
        :title="'fees-page.no-balances-title' | globalize"
        :message="'fees-page.no-balances-msg' | globalize({
          asset: asset.code
        })"
      />
    </template>

    <template v-else-if="!isLoadingFailed">
      <loader message-id="fees-page.balances-loading-msg" />
    </template>

    <template v-else>
      <p>
        {{ 'fees-page.balances-loading-error-msg' | globalize }}
      </p>
    </template>
  </div>
</template>

<script>
import SelectField from '@/vue/fields/SelectField'
import TopBar from '@/vue/common/TopBar'
import Loader from '@/vue/common/Loader'
import NoDataMessage from '@/vue/common/NoDataMessage'

import { mapGetters, mapActions } from 'vuex'
import { vuexTypes } from '@/vuex'

import { ErrorHandler } from '@/js/helpers/error-handler'
import { FeesModule } from '@/vue/modules/fees/module'
import SubmoduleImporter from '@/modules-arch/submodule-importer'

import config from '@/config'

export default {
  name: 'fees-page',
  components: {
    SelectField,
    Loader,
    TopBar,
    NoDataMessage,
    SubmoduleImporter,
  },

  data: _ => ({
    isLoaded: false,
    isLoadingFailed: false,
    assets: [],
    asset: {},
    config: {
      horizonURL: config.HORIZON_SERVER,
    },
    FeesModule,
  }),

  computed: {
    ...mapGetters({
      balances: vuexTypes.accountBalances,
      wallet: vuexTypes.wallet,
    }),
  },

  watch: {
    asset (value) {
      this.$router.push({
        query: { asset: value.code },
      })
    },
  },

  async created () {
    try {
      await this.initAssetSelector()
      this.isLoaded = true
    } catch (error) {
      this.isLoadingFailed = true
      ErrorHandler.processWithoutFeedback(error)
    }
  },

  methods: {
    ...mapActions({
      loadBalances: vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS,
    }),

    async initAssetSelector () {
      await this.loadAssets()
      if (this.assets.length) {
        this.asset = this.assets
          .find(item => item.code === this.$route.query.asset) ||
          this.assets[0]
      }
    },

    async loadAssets () {
      await this.loadBalances()
      this.assets = this.balances
        .map(item => item.assetDetails)
    },
  },
}
</script>

<style lang="scss" scoped>
@import "~@scss/variables";

.fees-renderer {
  width: 100%;
}

.fees-renderer__filter {
  display: inline-flex;
  align-items: center;
}

.fees-renderer__filter-prefix {
  margin-right: 1.5rem;
  line-height: 1;
}
</style>
