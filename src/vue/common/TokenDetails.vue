<template>
  <div class="token-details">
    <div class="token-details__header">
      <token-logo
        :logo-key="token.logoKey"
        :token-code="token.code"
      />
      <div class="token-details__info">
        <p class="token-details__code">
          {{ token.code }}
        </p>
        <p class="token-details__name">
          {{ token.name }}
        </p>
      </div>
    </div>
    <table class="app__table token-details__table">
      <tbody>
        <tr v-if="token.getBalance(balances).value">
          <td>
            {{ 'token-details.balance-title' | globalize }}
          </td>
          <td>
            {{ token.getBalance(balances) | formatMoney }}
          </td>
        </tr>
        <tr>
          <td>
            {{ 'token-details.maximum-title' | globalize }}
          </td>
          <td>
            {{ token.maxIssuanceAmount | formatMoney }}
          </td>
        </tr>
        <tr>
          <td>
            {{ 'token-details.issued-title' | globalize }}
          </td>
          <td>
            {{ token.issued | formatMoney }}
          </td>
        </tr>
        <tr>
          <td>
            {{ 'token-details.available-title' | globalize }}
          </td>
          <td>
            {{ token.availableForIssuance | formatMoney }}
          </td>
        </tr>
        <tr>
          <td>
            {{ 'token-details.terms-title' | globalize }}
          </td>
          <td>
            <a
              v-if="token.termsKey"
              class="token-details__terms"
              :href="tokenTermsUrl"
            >
              {{ 'token-details.download-terms-btn' | globalize }}
            </a>
            <p v-else>
              {{ 'token-details.no-terms-msg' | globalize }}
            </p>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="token-details__buttons">
      <button
        v-ripple
        class="token-details__update-btn"
        :disabled="token.getBalance(balances).value || isBalanceCreating"
        @click="createBalance"
      >
        {{ 'token-details.add-balance-btn' | globalize }}
      </button>
    </div>
  </div>
</template>

<script>
import TokenLogo from '@/vue/common/TokenLogo'

import config from '@/config'

import { Sdk } from '@/sdk'

import { base } from '@tokend/js-sdk'

import { ErrorHandler } from '@/js/helpers/error-handler'
import { Bus } from '@/js/helpers/event-bus'

import { mapGetters, mapActions } from 'vuex'
import { vuexTypes } from '@/vuex'

export default {
  name: 'token-details',
  components: {
    TokenLogo,
  },
  props: {
    token: { type: Object, required: true },
  },
  data: _ => ({
    isBalanceCreating: false,
  }),
  computed: {
    ...mapGetters({
      account: vuexTypes.account,
      balances: vuexTypes.accountBalances,
    }),
    tokenTermsUrl () {
      return this.token.termsUrl(config.FILE_STORAGE)
    },
  },
  methods: {
    ...mapActions({
      loadBalances: vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS,
    }),
    async createBalance () {
      this.isBalanceCreating = true
      try {
        const operation = base.Operation.manageBalance({
          destination: this.account.accountId,
          asset: this.token.code,
          action: base.xdr.ManageBalanceAction.createUnique(),
        })
        await Sdk.horizon.transactions.submitOperations(operation)
        await this.loadBalances()
        Bus.success('token-details.balance-added-msg')
      } catch (e) {
        this.isBalanceCreating = false
        ErrorHandler.process(e)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import "~@scss/variables";
@import "~@scss/mixins";

.token-details__table {
  margin-top: 4rem;

  tr td:last-child {
    text-align: right;
  }
}

.token-details__terms {
  font-size: 1.4rem;
  color: $col-primary-lighten;
  text-decoration: none;

  &:visited {
    color: $col-primary-lighten;
  }
}

.token-details__buttons {
  margin-top: 4.9rem;
  display: flex;

  button + button {
    margin-left: auto;
  }
}

.token-details__update-btn {
  @include button-raised();

  margin-bottom: 2rem;
  width: 18rem;
}

.token-details__cancel-btn {
  @include button();

  padding-left: .1rem;
  padding-right: .1rem;
  margin-bottom: 2rem;
  font-weight: normal;
}

.token-details__header {
  display: flex;
  align-items: center;

  .token-details__logo {
    width: 5rem;
    height: 5rem;
    border-radius: 50%
  }

  .token-details__info {
    margin-left: 1.8rem;

    .token-details__code {
      font-size: 1.8rem;
      font-weight: bold;
      color: $col-primary;
    }

    .token-details__name {
      margin-top: .1rem;
      font-size: 1.4rem;
      line-height: 1.29;
      color: $col-primary;
    }
  }
}
</style>
