<template>
  <span class="email-getter" v-if="isLoading">{{ i18n.lbl_loading() }}</span>
  <span class="email-getter" v-else>{{ email || fallback || id }}</span>
</template>

<script>
import { accountsService } from 'L@/js/services/accounts.service'
import { i18n } from 'L@/js/i18n'
export default {
  props: {
    id: { type: String, required: true },
    fallback: { type: String, default: '' }
  },
  data: _ => ({
    email: null,
    isLoading: false,
    i18n
  }),
  created () {
    this.getEmail()
  },
  methods: {
    async getEmail () {
      this.isLoading = true
      try {
        this.email = (await accountsService.loadEmailByAccountId(this.id))
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
