<template>
  <div class="tokens-explorer">
    <drawer :is-shown.sync="isDetailsDrawerShown">
      <template slot="heading">
        {{ 'tokens-page.token-details-title' | globalize }}
      </template>
    </drawer>
    <div class="token-cards">
      <a
        class="token-card"
        v-for="token in tokens"
        :key="token.code"
        @click="selectToken(token)"
      >
        <div class="token-card__header">
          <img
            v-if="token.details.logo.key"
            class="token-card__image"
            :src="getTokenLogoUrl(token)"
          >
          <img
            v-else
            class="token-card__image"
            src="/static/favicon.ico"
          >
        </div>
        <div class="token-card__info">
          <p class="token-card__code">
            {{ token.code }}
          </p>
          <p class="token-card__name">
            {{ token.details.name }}
          </p>
          <p class="token-card__balance">
            {{
              'tokens-page.balance-msg'| globalize({
                value: {
                  value: token.balance,
                  currency: token.asset,
                }
              })
            }}
          </p>
        </div>
      </a>
    </div>
  </div>
</template>

<script>
import Drawer from '@/vue/common/Drawer'

import { Sdk } from '@/sdk'

import { ErrorHandler } from '@/js/helpers/error-handler'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

import config from '@/config'

export default {
  name: 'balances',
  components: {
    Drawer,
  },
  data: _ => ({
    tokens: [],
    isDetailsDrawerShown: false,
    selectedToken: null,
  }),
  computed: {
    ...mapGetters({
      account: vuexTypes.account,
    }),
  },
  async created () {
    await this.loadTokens()
  },
  methods: {
    async loadTokens () {
      try {
        const { data } = await Sdk.horizon.assets.getAll()
        this.tokens = this.account.balances.map(balance => {
          const token = data.find(token => token.code === balance.asset)
          return Object.assign(balance, token)
        })
      } catch (e) {
        ErrorHandler.processWithoutFeedback(e)
      }
    },
    getTokenLogoUrl (token) {
      return config.FILE_STORAGE + token.details.logo.key
    },
    selectToken (token) {
      this.selectedToken = token
      this.isDetailsDrawerShown = true
    },
  },
}
</script>

<style lang="scss" scoped>
@import "~@scss/variables";
@import "~@scss/mixins";

.token-cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  margin: -.75rem;
}

.token-card {
  flex: 0 1 calc(25% - 1.5rem);
  min-height: 19rem;
  cursor: pointer;
  border-radius: .4rem;
  box-shadow: 0 .5rem 1rem 0 $col-field-shadow;
  background-color: $col-token-card-background;
  margin: .75rem;

  @include respond-to($medium) {
    flex: 0 1 calc(33% - 3rem);
  }

  @include respond-to($x-small) {
    flex: 0 1 calc(100% - 3rem);
  }
}

.token-card__header {
  border-radius: .4rem .4rem 0rem 0rem;
  height: 8.5rem;
  background-color: $col-token-card-header-background;
  padding-top: 1.5rem;
}

.token-card__info {
  padding: 1.6rem 2rem;
}

.token-card__code {
  font-size: 1.8rem;
  font-weight: bold;
  color: $col-token-card-text-primary;
}

.token-card__name {
  margin-top: .2rem;
  font-size: 1.4rem;
  line-height: 1.29;
  color: $col-token-card-text-primary;
}

.token-card__balance {
  margin-top: 1.2rem;
  font-size: 1.2rem;
  line-height: 1.5;
  color: $col-token-card-text-primary;
}

.token-card__image {
  width: 5.3rem;
  height: 5.3rem;
  border-radius: 50%;
  display: block;
  margin: 0 auto;
}
</style>
