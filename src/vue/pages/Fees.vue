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

      <fees
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
import Fees from '@/vue/pages/FeesAll'
import TopBar from '@/vue/common/TopBar'
import NoDataMessage from '@/vue/common/NoDataMessage'

import { mapGetters, mapActions } from 'vuex'
import { vuexTypes } from '@/vuex'

import { ErrorHandler } from '@/js/helpers/error-handler'
import SkeletonLoader from '@/vue/common/skeleton-loader/SkeletonLoader'

export default {
  name: 'fees-page',
  components: {
    SelectField,
    TopBar,
    Fees,
    NoDataMessage,
    SkeletonLoader,
  },

  data: _ => ({
    isLoaded: false,
    isLoadingFailed: false,
    assets: [],
    asset: {},
  }),

  computed: {
    ...mapGetters({
      balances: vuexTypes.accountBalances,
    }),
  },

  watch: {
    async asset (value) {
      await this.$router.push({
        query: { asset: value.code },
      }, () => {})
    },
  },

  created () {
    this.initAssetSelector()
  },

  methods: {
    ...mapActions({
      loadBalances: vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS,
    }),

    setAssetByCode (code) {
      this.asset = this.assets.find(item => item.code === code)
    },

    async initAssetSelector () {
      try {
        await this.loadAssets()
        if (this.assets.length) {
          this.asset = this.assets
            .find(item => item.code === this.$route.query.asset) ||
          this.assets[0]
        }
        this.isLoaded = true
      } catch (error) {
        this.isLoadingFailed = true
        ErrorHandler.processWithoutFeedback(error)
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
