<template>
  <div class="asset-selector">
    <template>
      <div
        class="asset-selector__wrapper"
      >
        <div class="asset-selector__select">
          <skeleton-template
            :is-loading="imgUrl === null || !currentAsset ||
              tokens.length === 0"
          >
            <div class="asset-selector__select-picture">
              <img
                v-if="imgUrl"
                class="asset-selector__asset-logo"
                :src="imgUrl"
              >
              <p
                v-if="currentAsset && !imgUrl"
                class="asset-selector__asset-code-abbr"
              >
                {{ currentAsset | abbreviate }}
              </p>
            </div>
          </skeleton-template>
          <div>
            <skeleton-template
              :is-loading="imgUrl === null || !currentAsset ||
                tokens.length === 0"
            >
              <select-field
                :value="currentAssetForSelect"
                :values="tokensList"
                :key="currentAssetForSelect.code"
                key-as-value-text="nameAndCode"
                @input="$emit(EVENTS.assetChange, $event)"
                class="app__select app__select--no-border"
              />
            </skeleton-template>
          </div>
        </div>
      </div>
      <template v-if="currentAsset">
        <div class="asset-selector__wrapper asset-selector__wrapper--values">
          <div class="asset-selector__asset-available">
            <div class="asset-selector__asset-value">
              <span class="asset-selector__asset-value-main">
                {{
                  currentAssetBalanceDetails.balance | formatMoney({
                    currency: currentAsset
                  })
                }}
                {{ currentAsset }}
              </span>
            </div>
            <div class="asset-selector__asset-subvalue">
              <span class="asset-selector__asset-value-secondary">
                {{
                  currentAssetBalanceDetails.convertedBalance | formatMoney({
                    currency: config.DEFAULT_QUOTE_ASSET, symbolAllowed: true
                  })
                }}
                {{ config.DEFAULT_QUOTE_ASSET }}
              </span>
            </div>
          </div>
        </div>
      </template>
      <template v-if="tokens.length && !currentAsset">
        <no-data-message
          :title="'dashboard.no-assets-in-your-wallet' | globalize"
          :message="'dashboard.here-will-be-the-tokens' | globalize"
        />
      </template>
    </template>
    <template v-if="isLoadingFailed">
      <p>
        {{ 'dashboard.loading-error-msg' | globalize }}
      </p>
    </template>
  </div>
</template>

<script>
import config from '@/config'
import SelectField from '@/vue/fields/SelectField'
import NoDataMessage from '@/vue/common/NoDataMessage'
import { ASSET_POLICIES } from '@tokend/js-sdk'
import { mapGetters, mapActions } from 'vuex'
import { vuexTypes } from '@/vuex'
import { Sdk } from '@/sdk'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { AssetRecord } from '@/js/records/entities/asset.record'
import SkeletonTemplate from '@/vue/common/skeleton-screen/SkeletonTemplate'

const EVENTS = {
  assetChange: 'asset-change',
}

export default {
  name: 'dashboard-asset-selector',
  components: {
    SelectField,
    NoDataMessage,
    SkeletonTemplate,
  },
  props: {
    currentAsset: {
      type: [String, Object],
      default: config.DEFAULT_QUOTE_ASSET,
    },
  },
  data: () => ({
    EVENTS,
    tokens: [],
    isLoadingFailed: false,
    config,
    ASSET_POLICIES,
  }),
  computed: {
    ...mapGetters({
      balances: vuexTypes.accountBalances,
    }),
    tokensList () {
      const balancesAssetCodes = this.balances.map(i => i.asset)
      const tokens = this.tokens
        .filter(token => balancesAssetCodes.includes(token.code))
      // this separation on baseAssets and otherAssets needed to display them
      // correcty in the list of all tokens: baseAssets should be displayed at
      // the beginning and otherAssets after baseAssets

      // String.localeCompare() compare two strings and returns
      // them in alphabet order
      const baseAssets = tokens
        .filter(token => token.isBaseAsset)
        .sort((a, b) => a.code.localeCompare(b.code))
      const otherAssets = tokens
        .filter(token => !token.isBaseAsset)
        .sort((a, b) => a.code.localeCompare(b.code))
      return [
        ...baseAssets,
        ...otherAssets,
      ]
    },
    currentAssetForSelect () {
      return this.tokens.find(t => t.code === this.currentAsset) || {}
    },
    currentAssetBalanceDetails () {
      return this.balances
        .find(i => i.asset === this.currentAsset) || {}
    },
    imgUrl () {
      if (this.balances.length > 0 && this.currentAsset) {
        const balance = this.balances.find(i => i.asset === this.currentAsset)
        return balance.assetDetails.logoUrl(config.FILE_STORAGE)
      } else {
        return null
      }
    },
  },
  async created () {
    await this.loadTokens()
    await this.loadBalances()
  },
  methods: {
    ...mapActions({
      loadBalances: vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS,
    }),
    async loadTokens () {
      try {
        const response = await Sdk.horizon.assets.getAll()
        this.tokens = response.data.map(asset => new AssetRecord(asset))
      } catch (error) {
        this.isLoadingFailed = true
        ErrorHandler.processWithoutFeedback(error)
      }
    },
  },
}
</script>

<style lang="scss">
@import "~@scss/variables.scss";
@import "~@scss/mixins.scss";

$custom-breakpoint-small: 540px;
$custom-breakpoint: 800px;
$custom-breakpoint-medium: 870px;

.asset-selector {
  @include respond-to-custom($custom-breakpoint-medium) {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
}

.asset-selector__wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;

  @include respond-to-custom($custom-breakpoint-medium) {
    flex-direction: column;
    align-items: flex-start;
  }

  @include respond-to(tablet) {
    flex-direction: row;
    align-items: center;
  }

  @include respond-to-custom($custom-breakpoint-small) {
    flex-direction: column;
    align-items: flex-start;
  }
}

.asset-selector__wrapper--values {
  align-items: flex-end;

  @include respond-to(medium) {
    align-items: flex-end;
  }

  @include respond-to-custom($custom-breakpoint) {
    flex-direction: column;
    align-items: flex-start;
  }
}

.asset-selector__select {
  display: flex;
  align-items: center;
  margin-right: 1.6rem;

  @include respond-to-custom($custom-breakpoint-medium) {
    margin-bottom: 2.4rem;
  }

  @include respond-to(tablet) {
    margin-bottom: 0;
  }

  @include respond-to-custom($custom-breakpoint-small) {
    margin-bottom: 2.4rem;
  }
}

.asset-selector__select-picture {
  margin-right: 1.6rem;
  display: flex;

  & > * {
    width: 5.5rem;
    height: 5.5rem;
    border-radius: .2rem;
    @include box-shadow();

    @include respond-to(small) {
      width: 4rem;
      height: 4rem;
    }
  }

  img {
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
}

.asset-selector__asset-available {
  margin-top: 3.2rem;
}

.asset-selector__asset-value {
  font-size: 3rem;
  color: $col-details-value;
}

.asset-selector__asset-subvalue {
  margin-top: .8rem;
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
