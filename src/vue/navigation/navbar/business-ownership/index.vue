<template>
  <div />
</template>

<script>
import { vueRoutes } from '@/vue-router/routes'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

const ROUTES_WITH_OWNER_FILTER = [
  vueRoutes.atomicSwapsExplore.name,
]

export default {
  name: 'business-ownership',

  computed: {
    ...mapGetters([
      vuexTypes.accountId,
      vuexTypes.isAccountCorporate,
    ]),

    currentBusinessId () {
      return this.isAccountCorporate ? this.accountId : ''
    },
  },

  created () {
    this.initRouterHooks()
  },

  methods: {
    initRouterHooks () {
      this.$router.beforeEach((to, from, next) => {
        if (ROUTES_WITH_OWNER_FILTER.includes(to.name) &&
          this.currentBusinessId &&
          to.query.owner !== this.currentBusinessId
        ) {
          to.query.owner = this.currentBusinessId
          next(to)
        } else {
          next()
        }
      })
    },
  },
}
</script>

<style lang="scss">
</style>
