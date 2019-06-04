<template>
  <div class="asset-selector">
    <template v-if="assets.length">
      <div
        class="asset-selector__wrapper"
        v-if="currentAsset"
      >
        <div class="asset-selector__select">
          <div class="asset-selector__select-picture">
            <img
              v-if="imgUrl"
              class="asset-selector__select-picture-tag"
              :src="imgUrl"
            >
            <p
              v-else
              class="asset-selector__asset-code-abbr"
            >
              {{ currentAsset | abbreviate }}
            </p>
          </div>
          <div>
            <select-field
              :value="currentAssetForSelect"
              :values="assetsList"
              :key="currentAssetForSelect.code"
              key-as-value-text="nameAndCode"
              @input="$emit(EVENTS.assetChange, $event)"
              class="app__select app__select--no-border"
            />
          </div>
        </div>
      </div>
      <template v-if="currentAsset">
        <div class="asset-selector__wrapper asset-selector__wrapper--values">
          <div class="asset-selector__asset-available">
            <div class="asset-selector__asset-value">
              <span class="asset-selector__asset-value-main">
                {{
                  {
                    value: currentAssetBalanceDetails.balance,
                    currency: currentAsset
                  } | formatMoney
                }}
              </span>
            </div>

            <div
              class="asset-selector__asset-converted"
              v-if="currentAssetBalanceDetails.convertedBalance"
            >
              <span class="asset-selector__asset-value-secondary">
                {{
                  {
                    value: currentAssetBalanceDetails.convertedBalance,
                    currency: currentAssetBalanceDetails.convertedToAsset
                  } | formatMoney
                }}
              </span>
            </div>
          </div>
        </div>
      </template>
      <template v-if="!currentAsset">
        <no-data-message
          :title="'dashboard.no-assets-in-your-wallet' | globalize"
          :message="'dashboard.here-will-be-the-assets' | globalize"
        />
      </template>
    </template>
    <template v-else-if="isLoadingFailed">
      <p>
        {{ 'dashboard.loading-error-msg' | globalize }}
      </p>
    </template>
    <template v-else>
      <loader message-id="dashboard.loading-msg" />
    </template>
  </div>
</template>

<script>
import Loader from '@/vue/common/Loader'
import config from '@/config'
import SelectField from '@/vue/fields/SelectField'
import NoDataMessage from '@/vue/common/NoDataMessage'
import { ASSET_POLICIES } from '@tokend/js-sdk'
import { mapGetters, mapActions } from 'vuex'
import { vuexTypes } from '@/vuex'
import { api, documentsManager } from '@/api'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { AssetRecord } from '@/js/records/entities/asset.record'

const EVENTS = {
  assetChange: 'asset-change',
}

export default {
  name: 'dashboard-asset-selector',
  components: {
    SelectField,
    NoDataMessage,
    Loader,
  },
  props: {
    currentAsset: {
      type: [String],
      default: '',
    },
  },
  data: () => ({
    EVENTS,
    assets: [],
    isLoadingFailed: false,
    config,
    ASSET_POLICIES,
  }),
  computed: {
    ...mapGetters({
      accountId: vuexTypes.accountId,
      balances: vuexTypes.accountBalances,
      defaultQuoteAsset: vuexTypes.defaultQuoteAsset,
    }),
    assetsList () {
      // this separation on baseAssets and otherAssets needed to display them
      // correcty in the list of all assets: baseAssets should be displayed at
      // the beginning and otherAssets after baseAssets

      // String.localeCompare() compare two strings and returns
      // them in alphabet order
      const baseAssets = this.assets
        .filter(asset => asset.isBaseAsset)
        .sort((a, b) => a.code.localeCompare(b.code))
      const otherAssets = this.assets
        .filter(asset => !asset.isBaseAsset)
        .sort((a, b) => a.code.localeCompare(b.code))
      return [
        ...baseAssets,
        ...otherAssets,
      ]
    },
    currentAssetForSelect () {
      return this.assets.find(t => t.code === this.currentAsset) || {}
    },
    currentAssetBalanceDetails () {
      return this.balances
        .find(i => i.asset.code === this.currentAsset) || {}
    },
    imgUrl () {
      const balance = this.balances
        .find(i => i.asset.code === this.currentAsset)
      return documentsManager.getDocumentUrlByKey(balance.asset.logoKey)
    },
  },
  async created () {
    await this.loadAssets()
    await this.loadBalances()
  },
  methods: {
    ...mapActions({
      loadBalances: vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS,
    }),
    async loadAssets () {
      try {
        const endpoint = `/v3/accounts/${this.accountId}`
        const { data: account } = await api.get(endpoint, {
          include: ['balances.asset'],
        })

        this.assets = account.balances
          .map(b => b.asset)
          .map(a => new AssetRecord(a))
      } catch (error) {
        this.isLoadingFailed = true
        ErrorHandler.processWithoutFeedback(error)
      }
    },
  },
}
</script>

<style lang="scss">
@import '~@scss/variables.scss';
@import '~@scss/mixins.scss';

$media-custom-breakpoint-small: 540px;
$media-custom-breakpoint: 800px;
$media-custom-breakpoint-medium: 870px;

.asset-selector {
  @include respond-to-custom($media-custom-breakpoint-medium) {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
}

.asset-selector__wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;

  @include respond-to-custom($media-custom-breakpoint-medium) {
    flex-direction: column;
    align-items: flex-start;
  }
  @include respond-to(tablet) {
    flex-direction: row;
    align-items: center;
  }
  @include respond-to-custom($media-custom-breakpoint-small) {
    flex-direction: column;
    align-items: flex-start;
  }
}

.asset-selector__wrapper--values {
  align-items: flex-end;

  @include respond-to(medium) {
    align-items: flex-end;
  }
  @include respond-to-custom($media-custom-breakpoint) {
    flex-direction: column;
    align-items: flex-start;
  }
}

.asset-selector__select {
  display: flex;
  align-items: center;
  margin-right: 1.6rem;

  @include respond-to-custom($media-custom-breakpoint-medium) {
    margin-bottom: 2.4rem;
  }
  @include respond-to(tablet) {
    margin-bottom: 0;
  }
  @include respond-to-custom($media-custom-breakpoint-small) {
    margin-bottom: 2.4rem;
  }
}

.asset-selector__select-picture {
  margin-right: 1.6rem;
  display: flex;
}

.asset-selector__select-picture > * {
  width: 5.5rem;
  height: 5.5rem;
  border-radius: 0.2rem;

  @include box-shadow();
  @include respond-to(small) {
    width: 4rem;
    height: 4rem;
  }
}

.asset-selector__select-picture-tag {
  object-fit: contain;
}

.asset-selector__asset-code-abbr {
  font-size: 2.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $col-asset-logo-background;
  color: $col-asset-logo-text;
}

.asset-selector__asset-available {
  margin-top: 3.2rem;
}

.asset-selector__asset-value {
  font-size: 3rem;
  color: $col-details-value;
}

.asset-selector__asset-converted {
  margin-top: 0.8rem;
  font-size: 1.6rem;
  color: $col-details-label;
}

.asset-selector__asset-value-main {
  font-size: 3rem;
}

.asset-selector__asset-value-secondary {
  font-size: 1.6rem;
}
</style>
