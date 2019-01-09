<template>
  <span class="email-getter" v-if="isLoading">
    {{ 'email-getter.loading' }}
  </span>
  <span class="email-getter" v-else>
    {{ email || fallback || id }}
  </span>
</template>

<script>
import { Sdk } from '@/sdk'

export default {
  props: {
    id: { type: String, required: true },
    fallback: { type: String, default: '' }
  },
  data: _ => ({
    email: null,
    isLoading: false
  }),
  created () {
    this.getEmail()
  },
  methods: {
    async getEmail () {
      this.isLoading = true
      try {
        this.email = (await Sdk.horizon.account.get(this.id))
      } catch (e) {
        console.error(e)
      }
      this.isLoading = false
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
