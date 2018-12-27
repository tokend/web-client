<template>
  <div class="portfolio-widget">
    <div
      class="portfolio-widget__wrapper"
      v-if="currentAsset"
    >
      <div class="portfolio-widget__select">
        <div class="portfolio-widget__select-picture">
          <img
            class="portfolio-widget__asset"
            :src="imgUrl"
          >
        </div>
        <div class="portfolio-widget__select-field">
          <!--
              :key is a hack to ensure that the component will be updated
              after computed calculated
            -->
          <select-field-custom
            :value="currentAssetForSelect"
            :values="tokensList"
            :key="currentAssetForSelect"
            @input="$emit(EVENTS.assetChange, $event)"
          />
        </div>
      </div>
      <div class="portfolio-widget__actions">
        <button
          v-if="accountTypeI === ACCOUNT_TYPES.syndicate"
          class="app__button-raised portfolio-widget__action"
          @click="$emit(EVENTS.showCreateIssuanceForm, true)">
          Create issuance
        </button>
        <button
          class="app__button-raised portfolio-widget__action">
          Send {{ currentAsset }}
        </button>
      </div>
    </div>
    <template v-if="currentAsset">
      <div class="portfolio-widget__wrapper portfolio-widget__wrapper--values">
        <div class="portfolio-widget__asset-available">
          <div class="portfolio-widget__asset-value">
            <span class="portfolio-widget__asset-value-main">
              {{ balance | formatMoney({ currency: currentAsset }) }}
            </span>
            <span class="portfolio-widget__asset-value-secondary">
              &asymp;
              {{
                convertedBalance | formatMoney({
                  currency: config.DEFAULT_QUOTE_ASSET, symbolAllowed: true
                })
              }}
            </span>
          </div>
          <div class="portfolio-widget__asset-subvalue">
            <span class="portfolio-widget__asset-value-secondary">
              {{ 'tx-history.locked' | globalize }}
              {{ locked | formatMoney({ currency: currentAsset }) }}
            </span>
            <span class="portfolio-widget__asset-value-secondary">
              &asymp;
              {{
                convertedLocked | formatMoney({
                  currency: config.DEFAULT_QUOTE_ASSET, symbolAllowed: true
                })
              }}
            </span>
          </div>
        </div>
      </div>
    </template>
    <template v-if="!currentAsset">
      <no-data-message
        icon-name="toll"
        :msg-title="'tx-history.no-assets-in-your-wallet' | globalize"
        :msg-message="'tx-history.here-will-be-the-tokens' | globalize"
      />
    </template>
  </div>
</template>

<script>
import config from '@/config'
import SelectFieldCustom from '@/vue/fields/SelectFieldCustom'
import NoDataMessage from '@/vue/common/NoDataMessage'
// FIXME: move XDR-dependent object imports to sdk
import { ASSET_POLICIES, ACCOUNT_TYPES } from '@/js/const/xdr.const'
import { mapGetters, mapActions } from 'vuex'
import { vuexTypes } from '@/vuex'
import get from 'lodash/get'

const EVENTS = {
  assetChange: 'asset-change',
  showCreateIssuanceForm: 'show-create-issuance-form'
}

export default {
  name: 'portfolio-widget',
  components: {
    SelectFieldCustom,
    NoDataMessage
  },
  props: {
    currentAsset: {
      type: [String, Object],
      default: config.DEFAULT_QUOTE_ASSET
    }
  },
  data: () => ({
    EVENTS,
    tabs: {
      hour: 'hour',
      day: 'day',
      week: 'week',
      month: 'month',
      year: 'year',
      all: 'all'
    },
    config,
    ASSET_POLICIES,
    ACCOUNT_TYPES
  }),
  computed: {
    ...mapGetters({
      balances: vuexTypes.accountBalances,
      accountTypeI: vuexTypes.accountTypeI,
      userTransferableTokens: vuexTypes.userTransferableTokens,
      tokens: vuexTypes.tokens
    }),
    tokensList () {
      const tokens = this.tokens
        .filter(token => Object.keys(this.balances).includes(token.code))
      const baseAssets = tokens
        .filter(token => token.policies.includes(ASSET_POLICIES.baseAsset))
        .sort((a, b) => a.code.localeCompare(b.code))
      const otherAssets = tokens
        .filter(token => !token.policies.includes(ASSET_POLICIES.baseAsset))
        .sort((a, b) => a.code.localeCompare(b.code))
      return [
        ...baseAssets,
        ...otherAssets
      ].map(item => `${item.name} (${item.code})`)
    },
    currentAssetForSelect () {
      return this.tokens.filter(token => token.code === this.currentAsset)
        .map(item => `${item.name} (${item.code})`)[0]
    },
    balance () {
      return get(this.balances, `${this.currentAsset}.balance`) || 0
    },
    convertedBalance () {
      return get(this.balances, `${this.currentAsset}.converted_balance`) || 0
    },
    locked () {
      return get(this.balances, `${this.currentAsset}.locked`) || 0
    },
    convertedLocked () {
      return get(this.balances, `${this.currentAsset}.converted_locked`) || 0
    },
    imgUrl () {
      const defaultUrl = '../../../../../static/coin-picture.png'
      const logoKey = get(
        this.balances,
        `${this.currentAsset}.asset_details.details.logo.key`
      )
      if (logoKey) {
        return `${config.FILE_STORAGE}/${logoKey}`
      }
      return defaultUrl
    },
    checkTransferable () {
      return !(this.userTransferableTokens
        .map(token => token.code))
        .includes(this.currentAsset)
    }
  },
  async created () {
    await this.loadTokens()
  },
  methods: {
    ...mapActions({
      loadTokens: vuexTypes.GET_ALL_TOKENS
    })
  }
}
</script>

<style lang="scss" scoped>
@import "~@scss/variables.scss";
@import "~@scss/mixins.scss";

$custom-breakpoint: 80rem;

.portfolio-widget__wrapper {
  display: flex;
  justify-content: space-between;

  @include respond-to-custom($custom-breakpoint) {
    flex-direction: column-reverse;
  }
}

.portfolio-widget__wrapper--values {
  align-items: flex-end;

  @include respond-to(medium) {
    align-items: flex-end;
  }

  @include respond-to-custom($custom-breakpoint) {
    flex-direction: column;
    align-items: flex-start;
  }
}

.portfolio-widget__select {
  display: flex;
  align-items: center;
  margin-right: 1.6rem;
}

.portfolio-widget__select-picture {
  width: 5.5rem;
  height: 5.5rem;
  padding: .4rem;
  border-radius: .2rem;
  background-color: $col-block-bg;
  box-shadow: 0 .4rem 1rem 0 rgba(0, 0, 0, 0.15);
  margin-right: 1.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: none;

  @include respond-to(small) {
    width: 4rem;
    height: 4rem;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.portfolio-widget__asset-available {
  margin-top: 3.2rem;
}

.portfolio-widget__asset-value {
  font-size: 3rem;
  color: $col-details-value;
}

.portfolio-widget__asset-subvalue {
  margin-top: .8rem;
  font-size: 1.6rem;
  color: $col-details-label;
}

.portfolio-widget__asset-value-secondary {
  color: $col-details-label;
}

.portfolio-widget__action {
  &:not(:first-child) {
    margin-left: 1.6rem;
  }
}
</style>
