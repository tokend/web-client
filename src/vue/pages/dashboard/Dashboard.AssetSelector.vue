<template>
  <div class="asset-selector">
    <template>
      <div
        class="asset-selector__wrapper"
      >
        <div class="asset-selector__select">
          <skeleton-loader
            v-if="imgUrl === null || !currentAsset ||
              assets.length === 0"
            template="bigIcon"
            class="asset-selector__select-picture"
          />
          <div v-else class="asset-selector__select-picture">
            <img
              v-if="imgUrl"
              class="asset-selector__select-picture-tag"
              :src="imgUrl"
            >
            <p
              v-if="currentAsset && !imgUrl"
              class="asset-selector__asset-code-abbr"
            >
              {{ currentAsset | abbreviate }}
            </p>
          </div>
          <div>
            <skeleton-loader
              v-if="imgUrl === null || !currentAsset ||
                assets.length === 0"
              class="app__select"
              template="bigString"
            />
            <select-field
              v-else
              :value="currentAssetForSelect.code"
              :key="currentAssetForSelect.code"
              @input="$emit(EVENTS.assetChange, $event)"
              class="app__select app__select--no-border"
            >
              <option
                v-for="asset in assetsList"
                :key="asset.code"
                :value="asset.code"
              >
                {{ asset.nameAndCode }}
              </option>
            </select-field>
          </div>
        </div>
      </div>
      <template>
        <div class="asset-selector__wrapper asset-selector__wrapper--values">
          <div class="asset-selector__asset-available">
            <div class="asset-selector__asset-value">
              <skeleton-loader
                v-if="!currentAsset"
                template="bigString"
              />
              <span
                v-else
                class="asset-selector__asset-value-main"
              >
                {{
                  {
                    value: currentAssetBalanceDetails.balance,
                    currency: currentAsset
                  } | formatMoney
                }}
              </span>
            </div>
            <div class="asset-selector__asset-subvalue">
              <skeleton-loader
                v-if="!currentAsset &&
                  currentAssetBalanceDetails.convertedBalance"
                template="bigString"
              />
              <div
                class="asset-selector__asset-converted"
                v-else-if="currentAssetBalanceDetails.convertedBalance"
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
        </div>
      </template>
      <template v-if="assets.length && !currentAsset">
        <no-data-message
          :title="'dashboard.no-assets-in-your-wallet' | globalize"
          :message="'dashboard.here-will-be-the-assets' | globalize"
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
import { api, documentsManager } from '@/api'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { AssetRecord } from '@/js/records/entities/asset.record'
import SkeletonLoader from '@/vue/common/skeleton-loader/SkeletonLoader'

const EVENTS = {
  assetChange: 'asset-change',
}

export default {
  name: 'dashboard-asset-selector',
  components: {
    SelectField,
    NoDataMessage,
    SkeletonLoader,
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
      if (this.balances.length && this.currentAsset) {
        try {
          const balance = this.balances
            .find(i => i.asset.code === this.currentAsset)
          return documentsManager.getDocumentUrlByKey(balance.asset.logoKey)
        } catch {
          return null
        }
      } else {
        return null
      }
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
