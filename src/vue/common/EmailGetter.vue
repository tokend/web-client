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
import { ErrorHandler } from '@/js/helpers/error-handler'

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
        const user = (await Sdk.api.users.getPage({
          address: this.id
        })).data
        this.email = user.length ? user[0].email : ''
      } catch (error) {
        ErrorHandler.process(error)
      }
      this.isLoading = false
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
