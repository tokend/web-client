<template>
  <div class="balance-explorer">
    <template v-if="isLoaded">
      <drawer :is-shown.sync="isDrawerShown">
        <template v-if="isUpdateMode">
          <template slot="heading">
            {{ 'assets.update-drawer-title' | globalize }}
          </template>

          <update-asset-form-module
            :asset-code="selectedAsset.code"
            @close="isDrawerShown = false"
          />
        </template>

        <template v-else>
          <template slot="heading">
            {{ 'assets.details-drawer-title' | globalize }}
          </template>
          <asset-attributes-viewer
            :asset="selectedAsset"
            :kyc-required-asset-type="kycRequiredAssetType"
            :security-asset-type="securityAssetType"
          />

          <button
            v-if="selectedAsset.owner === accountId"
            v-ripple
            class="app__button-raised balance-explorer__update-btn"
            @click="isUpdateMode = true"
          >
            {{ 'assets.update-btn' | globalize }}
          </button>
        </template>
      </drawer>

      <div class="balance-explorer__asset-list-wrp">
        <div class="balance-explorer__statistics">
          <div class="balance-explorer__filters">
            <select-field
              class="balance-explorer__field"
              v-model="assetType"
              key-as-value-text="labelTranslationId"
              :is-value-translatable="true"
              :values="assetTypes"
              :label="'assets.token-type' | globalize"
            />
          </div>
          <template v-if="assetType.value === ASSET_TYPES.corn">
            <div class="balance-explorer__filters">
              <select-field
                class="balance-explorer__field"
                v-model="elevatorCode"
                key-as-value-text="labelTranslationId"
                :is-value-translatable="true"
                :values="elevatorCodes"
                :label="'assets.elevator-code' | globalize"
              />
            </div>
            <div class="balance-explorer__filters">
              <select-field
                class="balance-explorer__field"
                v-model="cornType"
                key-as-value-text="labelTranslationId"
                :is-value-translatable="true"
                :values="cornTypes"
                :label="'create-asset-form.corn-type' | globalize"
              />
            </div>
            <div class="balance-explorer__filters">
              <select-field
                class="balance-explorer__field"
                v-model="cornClass"
                :values="cornClasses"
                :label="'create-asset-form.corn-class' | globalize"
              />
            </div>
            <div class="balance-explorer__statistics-info">
              {{ 'assets.total-corn-amount' | globalize }}: {{ totalGrain }}
            </div>
          </template>
        </div>
        <div
          v-if="filteredAssets.length"
          class="balance-explorer__asset-list"
        >
          <template v-for="asset in filteredAssets">
            <card-viewer
              :asset="asset"
              :key="asset.code"
              @click="selectAsset(asset)"
            />
          </template>
        </div>

        <no-data-message
          v-else
          icon-name="trending-up"
          :title="'assets.no-balances-title' | globalize"
          :message="'assets.no-balances-msg' | globalize"
        />
      </div>
    </template>

    <template v-else-if="isLoadFailed">
      <p class="balance-explorer__error-msg">
        {{ 'assets.loading-error-msg' | globalize }}
      </p>
    </template>

    <template v-else>
      <load-spinner message-id="assets.balances-loading-msg" />
    </template>
  </div>
</template>

<script>
import Drawer from '@/vue/common/Drawer'
import LoadSpinner from '@/vue/common/Loader'
import NoDataMessage from '@/vue/common/NoDataMessage'

import CardViewer from '../shared/components/card-viewer'
import AssetAttributesViewer from '../shared/components/asset-attributes-viewer'
import SelectField from '@/vue/fields/SelectField'

import UpdateAssetFormModule from '@modules/update-asset-form'

import { mapActions, mapGetters } from 'vuex'
import { types } from './store/types'
import { vuexTypes } from '@/vuex'

import { CORN_TYPE, CORN_CLASS } from '@/js/const/corn'

import { ErrorHandler } from '@/js/helpers/error-handler'

const ASSET_TYPES = {
  all: 'all',
  corn: 'corn',
  crypto: 'crypto',
}

export default {
  name: 'balance-explorer',
  components: {
    Drawer,
    LoadSpinner,
    NoDataMessage,
    CardViewer,
    AssetAttributesViewer,
    UpdateAssetFormModule,
    SelectField,
  },
  props: {
    defaultQuoteAsset: {
      type: String,
      required: true,
    },
  },
  data: _ => ({
    ASSET_TYPES,
    isLoaded: false,
    isLoadFailed: false,
    isDrawerShown: false,
    isUpdateMode: false,
    selectedAsset: {},
    assetType: {},
    cornType: {},
    cornClass: '',
    elevatorCode: '-',
  }),

  computed: {
    ...mapGetters({
      assets: vuexTypes.balancesAssets,
      accountBalances: vuexTypes.accountBalances,
      accountId: vuexTypes.accountId,
      accountBalanceByCode: vuexTypes.accountBalanceByCode,
    }),
    ...mapGetters('balance-explorer', {
      kycRequiredAssetType: types.kycRequiredAssetType,
      securityAssetType: types.securityAssetType,
    }),
    elevatorCodes () {
      return [
        '-',
        ...this.assets.reduce((codes, item) => {
          codes.add(item.details.elevatorCode)
          return codes
        }, new Set()),
      ]
    },
    filteredAssets () {
      let filteredAssets = []
      switch (this.assetType.value) {
        case ASSET_TYPES.all:
          filteredAssets = [...this.assets]
          break
        case ASSET_TYPES.corn:
          filteredAssets = this.assets.filter(item => item.details.cornClass)
          break
        case ASSET_TYPES.crypto:
          filteredAssets = this.assets.filter(item => !item.details.cornClass)
          break
        default:
          filteredAssets = []
          break
      }
      if (this.assetType.value === ASSET_TYPES.corn) {
        switch (this.cornType.value) {
          case CORN_TYPE.corn:
            filteredAssets = filteredAssets
              .filter(item => item.details.cornType === CORN_TYPE.corn)
            break
          case CORN_TYPE.wheat:
            filteredAssets = filteredAssets
              .filter(item => item.details.cornType === CORN_TYPE.wheat)
            break
          default:
            break
        }
        if (this.cornClass !== '-') {
          filteredAssets = filteredAssets
            .filter(item => item.details.cornClass === this.cornClass)
        }
        if (this.elevatorCode !== '-') {
          filteredAssets = filteredAssets
            .filter(item => item.details.elevatorCode === this.elevatorCode)
        }
      }
      return filteredAssets
    },
    assetTypes () {
      return [
        {
          labelTranslationId: 'assets.all',
          value: ASSET_TYPES.all,
        },
        {
          labelTranslationId: 'assets.corn-type',
          value: ASSET_TYPES.corn,
        },
        {
          labelTranslationId: 'assets.crypto',
          value: ASSET_TYPES.crypto,
        },
      ]
    },
    cornTypes () {
      return [
        {
          labelTranslationId: 'assets.all',
          value: CORN_TYPE.all,
        },
        {
          labelTranslationId: 'assets.wheat',
          value: CORN_TYPE.wheat,
        },
        {
          labelTranslationId: 'assets.corn',
          value: CORN_TYPE.corn,
        },
      ]
    },
    cornClasses () {
      return ['-', ...CORN_CLASS[this.cornType.value]]
    },
    totalGrain () {
      return this.filteredAssets.reduce((sum, item) => {
        return sum + +this.accountBalanceByCode(item.code).balance
      }, 0)
    },
  },

  watch: {
    assetType () {
      this.cornType = this.cornTypes[0]
      this.cornClass = this.cornClasses[0]
      this.elevatorCode = this.elevatorCodes[0]
    },
    cornType () {
      this.cornClass = this.cornClasses[0]
    },
  },
  async created () {
    this.assetType = this.assetTypes[0]
    this.cornType = this.cornTypes[0]
    this.cornClass = this.cornClasses[0]
    this.elevatorCode = this.elevatorCodes[0]
    await this.load()
  },

  methods: {
    ...mapActions({
      loadAccountBalances: vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS,
    }),
    ...mapActions('balance-explorer', {
      loadKycRequiredAssetType: types.LOAD_KYC_REQUIRED_ASSET_TYPE,
      loadSecurityAssetType: types.LOAD_SECURITY_ASSET_TYPE,
    }),

    async load () {
      try {
        await this.loadAccountBalances(this.defaultQuoteAsset)
        await this.loadKycRequiredAssetType()
        await this.loadSecurityAssetType()
        this.isLoaded = true
      } catch (e) {
        this.isLoadFailed = true
        ErrorHandler.processWithoutFeedback(e)
      }
    },

    selectAsset (asset) {
      this.selectedAsset = asset
      this.isUpdateMode = false
      this.isDrawerShown = true
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';

$asset-card-margin: 0.75rem;

$media-small-height: 460px;

.balance-explorer__asset-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  margin: -$asset-card-margin;
}

.balance-explorer__update-btn {
  margin-top: 4.9rem;
  max-width: 18rem;
  width: 100%;

  @include respond-to-height($media-small-height) {
    margin-top: 2.4rem;
  }
}

.balance-explorer__statistics {
  display: flex;
  align-items: center;
  width: 100%;
  padding-bottom: 4rem;
}

.balance-explorer__filters {
  display: flex;
}

.balance-explorer__field {
  display: inline-block;
  width: auto;
  min-width: 15rem;
  margin-right: 3rem;
}
</style>
