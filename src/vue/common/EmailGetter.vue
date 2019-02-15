<template>
  <span
    class="email-getter"
    :title="isTitled && (email || accountId || balanceId)"
  >
    <template v-if="isMasterAccount">
      {{ 'email-getter.master-account' | globalize }}
    </template>

    <template v-else-if="isLoading">
      {{ 'email-getter.loading-msg' | globalize }}
    </template>

    <template v-else-if="email">
      {{ email }}
    </template>

    <template v-else-if="accountId || balanceId">
      {{ accountId || balanceId | cropAddress }}
    </template>

    <template v-else>
      &mdash;
    </template>
  </span>
</template>

<script>
import { Sdk } from '@/sdk'
import { ErrorHandler } from '@/js/helpers/error-handler'

export default {
  props: {
    accountId: {
      type: String,
      default: '',
    },
    balanceId: {
      type: String,
      default: '',
    },
    isTitled: {
      type: Boolean,
      default: true,
    },
  },

  data: _ => ({
    email: '',
    isMasterAccount: false,
    isLoading: false,
  }),

  async created () {
    await this.init()
  },

  methods: {
    async init () {
      if (this.accountId === Sdk.networkDetails.masterAccountId) {
        this.isMasterAccount = true
        return
      }

      if (this.accountId || this.balanceId) {
        this.isLoading = true
        await this.loadEmail()
        this.isLoading = false
      }
    },

    async loadEmail () {
      try {
        const accountId = await this.getAccountId()
        const { data: { email } } = await Sdk.api.users.get(accountId)
        this.email = email
      } catch (error) {
        ErrorHandler.processWithoutFeedback(error)
      }
    },

    async getAccountId () {
      if (this.accountId) {
        return this.accountId
      } else if (this.balanceId) {
        const { data } = await Sdk.horizon.balances.getAccount(this.balanceId)
        return data.accountId
      } else {
        return ''
      }
    },
  },
}
</script>

<style scoped>
</style>
