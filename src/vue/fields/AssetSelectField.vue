<template>
  <div class="asset-select-field">
    <div
      v-if="isLoadFailed"
      class="asset-select-field__error-msg"
    >
      {{ 'asset-select-field.failed-loading-msg' | globalize }}
    </div>
    <select-field
      v-else-if="isLoaded"
      :value="currentAssetForSelect"
      :values="assetsList"
      :key="currentAssetForSelect.code"
      :key-as-value-text="assetsList[0] instanceof AssetRecord ?
        'nameAndCode' :
        EMPTY_VALUE.keyAsValueText"
      :is-value-translatable="!(assetsList[0] instanceof AssetRecord)"
      :disabled="!(assetsList[0] instanceof AssetRecord)"
      @input="$emit(EVENTS.input, currentAssetForSelect)"
      class="app__select app__select--no-border"
    />
  </div>
</template>

<script>
import SelectField from '@/vue/fields/SelectField'

import { api, loadingDataViaLoop } from '@/api'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { AssetRecord } from '@/js/records/entities/asset.record'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

const EVENTS = {
  input: 'input',
}
const ASSETS_PER_PAGE = 50

const TYPE_LOADING_ASSETS = {
  all: 'all',
  balances: 'balances',
}
const FILTER_STATUS = {
  true: 'true',
  false: 'false',
  notCheck: 'notCheck',
}

const EMPTY_VALUE = {
  name: 'asset-select-field.no-assets-for-select',
  keyAsValueText: 'name',
}

export default {
  name: 'asset-select-field',
  components: {
    SelectField,
  },
  props: {
    selectedAsset: { type: String, default: '' },
    typeLoadingAssets: { type: String, default: TYPE_LOADING_ASSETS.all },
    assetPolicies: { type: Array, default: () => [] },
    isDepositable: { type: String, default: FILTER_STATUS.notCheck },
    isCoinpayments: { type: String, default: FILTER_STATUS.notCheck },
    isFiat: { type: String, default: FILTER_STATUS.notCheck },
  },
  data () {
    return {
      AssetRecord,
      EMPTY_VALUE,
      EVENTS,
      assets: [],
      isLoaded: false,
      isLoadFailed: false,
    }
  },
  computed: {
    ...mapGetters({
      accountId: vuexTypes.accountId,
      balances: vuexTypes.accountBalances,
    }),
    currentAssetForSelect () {
      const asset = this.assetsList.find(t => t.code === this.selectedAsset) ||
        this.assetsList[0]
      this.$emit(EVENTS.input, asset)
      return asset
    },
    assetsList () {
      const filteredAssets = this.assets.reduce((filteredAssets, asset) => {
        let isFiltersValid = true
        if (this.assetPolicies.length) {
          let isPoliciesValid =
            this.assetPolicies.reduce(function (result, policy) {
              return result && !!(asset.policy & policy)
            }, true)
          isFiltersValid = isFiltersValid && isPoliciesValid
        }
        if (this.isDepositable !== FILTER_STATUS.notCheck) {
          isFiltersValid = isFiltersValid &&
            (this.isDepositable === asset.isDepositable + '')
        }
        if (this.isCoinpayments !== FILTER_STATUS.notCheck) {
          isFiltersValid = isFiltersValid &&
            (this.isCoinpayments === asset.isCoinpayments + '')
        }
        if (this.isFiat !== FILTER_STATUS.notCheck) {
          isFiltersValid = isFiltersValid &&
            (this.isFiat === asset.isFiat + '')
        }
        if (isFiltersValid) filteredAssets.push(asset)
        return filteredAssets
      }, [])
      if (!filteredAssets.length) return [EMPTY_VALUE]
      return filteredAssets
    },
  },
  async created () {
    switch (this.typeLoadingAssets) {
      case TYPE_LOADING_ASSETS.all:
        await this.loadAllAssets()
        break
      case TYPE_LOADING_ASSETS.balances:
        await this.loadBalancesAssets()
        break
      default:
        throw new Error('Unknown type of loading assets. typeLoadingAssets = ' +
          this.typeLoadingAssets)
    }
    this.isLoaded = true
  },
  methods: {
    async loadBalancesAssets () {
      try {
        const endpoint = `/v3/accounts/${this.accountId}`
        const { data: account } = await api.get(endpoint, {
          include: ['balances.asset'],
        })

        this.assets = account.balances
          .map(b => b.asset)
          .map(a => new AssetRecord(a))
      } catch (error) {
        this.isLoadFailed = true
        ErrorHandler.processWithoutFeedback(error)
      }
    },
    async loadAllAssets () {
      try {
        const params = {
          page: { limit: ASSETS_PER_PAGE },
        }
        if (this.assetPolicies.length) {
          const policy =
            this.assetPolicies.reduce((sum, policy) => sum + policy, 0)
          params.filter = { policy: policy }
        }
        const response = await api.get('/v3/assets', params)
        const assets = await loadingDataViaLoop(response)
        this.assets = assets.map(a => new AssetRecord(a))
      } catch (e) {
        this.isLoadFailed = true
        ErrorHandler.processWithoutFeedback()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
  @import '~@scss/variables';

  .asset-select-field__error-msg {
    color: $col-error;
  }
</style>
