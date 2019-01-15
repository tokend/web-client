<template>
  <span
    v-if="isLoaded"
    class="email-getter"
    :title="isTitled && result"
  >
    {{ result }}
  </span>
  <span
    v-else-if="isLoadingFailed"
    class="email-getter"
  >
    &mdash;
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
    isLoaded: false,
    isLoadingFailed: false
  }),

  async created () {
    if (this.accountId || this.balanceId) {
      await this.loadResult()
      this.isLoaded = true
    } else {
      this.isLoadingFailed = true
    }
  },

  methods: {
    async loadResult () {
      try {
        const accountId = await this.getAccountId()
        const { data } = await Sdk.api.users.get(accountId)
        this.result = data.email
      } catch (error) {
        if (config.DEBUG) {
          console.error(error)
        }
        this.result = this.accountId || this.balanceId
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
    }
  }
}
</script>

<style scoped>

</style>
