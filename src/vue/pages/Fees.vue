<template>
  <div class="fees-page">
    <template>
      <top-bar>
        <template slot="main">
          <div class="fees-page__filter">
            <span
              v-if="isLoaded && assets.length"
              class="fees-page__filter-prefix"
            >
              {{ 'fees-page.asset-filter-prefix' | globalize }}
            </span>
            <skeleton-loader
              v-else
              template="bigString"
            />
            <select-field
              v-if="isLoaded && assets.length"
              :value="asset.code"
              @input="setAssetByCode"
              class="app__select app__select--no-border"
            >
              <option
                v-for="asset in assets"
                :key="asset.code"
                :value="asset.code"
              >
                {{ asset.nameAndCode }}
              </option>
            </select-field>
            <skeleton-loader
              v-else
              template="bigString"
            />
          </div>
        </template>
      </top-bar>

      <submodule-importer
        v-if="asset.code && getModule().canRenderSubmodule(FeesModule)"
        :submodule="getModule().getSubmodule(FeesModule)"
        :asset-code="asset.code"
      />
    </template>

    <template v-if="isLoaded && !assets.length">
      <no-data-message
        icon-name="trending-up"
        :title="'fees-page.no-balances-title' | globalize"
        :message="'fees-page.no-balances-msg' | globalize({
          asset: asset.code
        })"
      />
    </template>

    <template v-if="isLoadingFailed">
      <p>
        {{ 'fees-page.balances-loading-error-msg' | globalize }}
      </p>
    </template>
  </div>
</template>

<script>
import SelectField from '@/vue/fields/SelectField'
import TopBar from '@/vue/common/TopBar'
import NoDataMessage from '@/vue/common/NoDataMessage'

import { mapGetters, mapActions } from 'vuex'
import { vuexTypes } from '@/vuex'

import { ErrorHandler } from '@/js/helpers/error-handler'
import { FeesModule } from '@/vue/modules/fees/module'
import SubmoduleImporter from '@/modules-arch/submodule-importer'
import SkeletonLoader from '@/vue/common/skeleton-loader/SkeletonLoader'

export default {
  name: 'fees-page',
  components: {
    SelectField,
    TopBar,
    NoDataMessage,
    SubmoduleImporter,
    SkeletonLoader,
  },

  data: _ => ({
    isLoaded: false,
    isLoadingFailed: false,
    assets: [],
    asset: {},
    FeesModule,
  }),

  computed: {
    ...mapGetters({
      balances: vuexTypes.accountBalances,
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

    setAssetByCode (code) {
      this.asset = this.assets.find(item => item.code === code)
    },

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
      this.assets = this.balances.map(item => item.asset)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';

.fees-page {
  width: 100%;
}

.fees-page__filter {
  display: inline-flex;
  align-items: center;
}

.fees-page__filter-prefix {
  margin-right: 1.5rem;
  line-height: 1;
}
</style>
