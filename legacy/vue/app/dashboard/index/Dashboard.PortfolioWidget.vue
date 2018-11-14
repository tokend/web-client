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
            @input="$emit(events.assetChange, $event)"
          />
        </div>
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
              <!-- eslint-disable-next-line -->
              &asymp; {{ convertedBalance | formatMoney({ currency: config.DEFAULT_QUOTE_ASSET, symbolAllowed: true }) }}
            </span>
          </div>
          <div class="portfolio-widget__asset-subvalue">
            <span class="portfolio-widget__asset-value-secondary">
              <!-- eslint-disable-next-line -->
              {{ i18n.lbl_locked() }} {{ locked | formatMoney({ currency: currentAsset }) }}
            </span>
            <span class="portfolio-widget__asset-value-secondary">
              <!-- eslint-disable-next-line -->
              &asymp; {{ convertedLocked | formatMoney({ currency: config.DEFAULT_QUOTE_ASSET, symbolAllowed: true }) }}
            </span>
          </div>
        </div>
      </div>
    </template>
    <template v-if="!currentAsset">
      <no-data-message
        icon-name="toll"
        :msg-title="i18n.th_no_assets_in_your_wallet()"
        :msg-message="i18n.th_here_will_be_tokens()"
      />
    </template>
  </div>
</template>

<script>
import config from '@/config'
import SelectFieldCustom from 'L@/vue/common/fields/SelectFieldCustom'
import NoDataMessage from 'L@/vue/common/messages/NoDataMessage'
import { ASSET_POLICIES } from 'L@/js/const/const'

import { mapGetters, mapActions } from 'vuex'
import { vuexTypes } from 'L@/vuex/types'
import { i18n } from 'L@/js/i18n'
import { commonEvents } from 'L@/js/events/common_events'
import get from 'lodash/get'

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
  data: _ => ({
    i18n,
    events: {
      assetChange: commonEvents.assetChangeEvent
    },
    tabs: {
      hour: 'hour',
      day: 'day',
      week: 'week',
      month: 'month',
      year: 'year',
      all: 'all'
    },
    config,
    ASSET_POLICIES
  }),
  computed: {
    ...mapGetters({
      balances: vuexTypes.accountBalances,
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
      const logoKey = get(
        this.balances,
        `${this.currentAsset}.asset_details.details.logo.key`
      )
      if (logoKey) {
        return `${config.FILE_STORAGE}/${logoKey}`
      }
      const defaultUrl = '../../../../../static/coin-picture.png'
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
@import "~L@scss/variables.scss";
@import "~L@scss/mixins.scss";

$custom-breakpoint: 800px;

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
  margin-right: 16px;
}

.portfolio-widget__select-picture {
  width: 55px;
  height: 55px;
  padding: 4px;
  border-radius: 2px;
  background-color: $col-block-bg;
  box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.15);
  margin-right: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: none;

  @include respond-to(small) {
    width: 40px;
    height: 40px;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.portfolio-widget__asset-available {
  margin-top: 32px;
}

.portfolio-widget__asset-value {
  font-size: 30px;
  color: $col-details-value;
}

.portfolio-widget__asset-subvalue {
  margin-top: 8px;
  font-size: 16px;
  color: $col-details-label;
}

.portfolio-widget__asset-value-secondary {
  color: $col-details-label;
}
</style>
