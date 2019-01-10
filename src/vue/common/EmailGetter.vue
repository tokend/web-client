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
    await this.loadEmail()
    this.isLoaded = true
  },
  methods: {
    async loadEmail () {
      try {
        const accountId = await this.getAccountId()
        const userResponse = await Sdk.api.users.get(accountId)
        this.result = userResponse.data.email
      } catch (e) {
        this.result = this.accountId || this.balanceId
      }
    },
    async getAccountId () {
      if (this.accountId) {
        return this.accountId
      }
      if (this.balanceId) {
        const response = await Sdk.horizon.balances.getAccount(this.balanceId)
        return response.data.accountId
      }
      throw new Error('You should provide either account or balance id')
    }
  }
}
</script>

<style scoped>

</style>
