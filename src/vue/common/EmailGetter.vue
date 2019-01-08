<template>
  <span
    v-if="isLoaded"
    class="email-getter"
    :title="isTitled && (email || id)"
  >
    {{ email || id }}
  </span>
  <span v-else>
    {{ 'email-getter.loading-lbl' | globalize }}
  </span>
</template>

<script>
import { Sdk } from '@/sdk'
import { errors } from '@tokend/js-sdk'

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
    email: '',
    isLoaded: false
  }),
  computed: {
    id () {
      return this.accountId || this.balanceId
    }
  },
  async created () {
    await this.loadEmail()
    this.isLoaded = true
  },
  methods: {
    async loadEmail () {
      let accountId

      if (this.accountId) {
        accountId = this.accountId
      } else if (this.balanceId) {
        const response = await Sdk.horizon.balances.getAccount(this.balanceId)
        accountId = response.data.accountId
      } else {
        throw new Error('You should provide either account or balance id')
      }

      const userResponse = await Sdk.api.users.get(accountId)
        .catch(error => error)
      if (!(userResponse instanceof errors.NotFoundError)) {
        this.email = userResponse.data.email
      }
    }
  }
}
</script>

<style scoped>

</style>
