<template>
  <span
    v-if="isLoaded"
    class="email-getter"
    :title="isTitled && result"
  >
    {{ result }}
  </span>
  <span
    v-else
    class="email-getter"
  >
    {{ 'email-getter.loading-lbl' | globalize }}
  </span>
</template>

<script>
import { Sdk } from '@/sdk'
import config from '@/config'

const FALLBACK_MESSAGES = {
  NO_ACCOUNT_OR_BALANCE_ID: '—' // M-dash
}

export default {
  props: {
    accountId: {
      type: String,
      default: ''
    },
    balanceId: {
      type: String,
      default: ''
    },
    isTitled: {
      type: Boolean,
      default: false
    }
  },
  data: _ => ({
    result: '',
    isLoaded: false
  }),

  async created () {
    if (this.isAccountIdOrBalanceIdPresent()) {
      await this.loadResult()
    } else {
      this.showNoAccountOrBalanceIdFallback()
    }
    this.isLoaded = true
  },

  methods: {
    isAccountIdOrBalanceIdPresent () {
      return Boolean(this.accountId || this.balanceId)
    },

    async loadResult () {
      try {
        const accountId = await this.getAccountId()
        this.result = await this.getEmailByAccountId(accountId)
      } catch (error) {
        if (config.DEBUG) {
          console.error(error)
        }
        this.result = this.accountId || this.balanceId
      }
    },

    showNoAccountOrBalanceIdFallback () {
      this.result = FALLBACK_MESSAGES.NO_ACCOUNT_OR_BALANCE_ID
    },

    async getAccountId () {
      if (this.accountId) {
        return this.accountId
      } else if (this.balanceId) {
        const response = await Sdk.horizon.balances.getAccount(this.balanceId)
        return response.data.accountId
      } else {
        return ''
      }
    },

    async getEmailByAccountId (accountId) {
      const response = await Sdk.api.users.get(accountId)
      return response.data.email
    }
  }
}
</script>

<style scoped>

</style>
