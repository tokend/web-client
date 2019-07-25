<template>
  <div class="current-business-indicator">
    <template v-if="businessToBrowse.accountId">
      <div class="current-business-indicator__inner">
        <div class="current-business-indicator__browsing-lbl">
          {{ 'current-business-indicator.browsing-lbl' | globalize }}
        </div>

        <div class="current-business-indicator__attrs">
          <current-business-logo
            class="current-business-indicator__logo"
            :business="businessToBrowse"
          />

          <p class="current-business-indicator__name">
            {{ businessToBrowse.name }}
          </p>
        </div>
      </div>
    </template>

    <template v-else>
      <slot />
    </template>
  </div>
</template>

<script>
import { BusinessRecord } from '@/js/records/entities/business.record'
import { Bus } from '@/js/helpers/event-bus'
import { vueRoutes } from '@/vue-router/routes'
import CurrentBusinessLogo from './current-business-logo'
import { mapGetters, mapMutations } from 'vuex'
import { vuexTypes } from '@/vuex'

const ROUTES_WITH_OWNER_FILTER = [
  vueRoutes.movements.name,
  vueRoutes.assets.name,
  vueRoutes.balances.name,
  vueRoutes.assetsExplore.name,
  vueRoutes.sales.name,
  vueRoutes.saleDetails.name,
  vueRoutes.saleCampaign.name,
  vueRoutes.investableSales.name,
  vueRoutes.userOwnedSales.name,
  vueRoutes.polls.name,
  vueRoutes.allPolls.name,
  vueRoutes.atomicSwaps.name,
  vueRoutes.atomicSwapsExplore.name,
]

/**
 * Warn: conto dirty code
 *
 * This file is full of hacks related to simulation of the separation of
 * business customer interfaces. To make the things look like "one customer
 * connects to business and see resources of that business only (assets, sales,
 * polls, etc)". To prevent messing up code used by most of the components of
 * vanilla and other schemes, we extracted dirty conto-related parts to this
 * file.
 */

export default {
  name: 'current-business-indicator',

  components: {
    CurrentBusinessLogo,
  },

  computed: {
    ...mapGetters([
      vuexTypes.isAccountCorporate,
      vuexTypes.isCustomerUiShown,
      vuexTypes.businessToBrowse,
    ]),
  },

  created () {
    // this.checkCurrentRouteAccessible()
    this.listen()
    this.initRouterHooks()
  },

  methods: {
    ...mapMutations([
      vuexTypes.SELECT_BUSINESS_TO_BROWSE,
      vuexTypes.CLEAR_BUSINESS_TO_BROWSE,
    ]),

    // checkCurrentRouteAccessible () {
    //   if (
    //     ROUTES_WITH_OWNER_FILTER.includes(this.$route.name) &&
    //     !this.businessToBrowse.accountId
    //   ) {
    //     this.$router.push(vueRoutes.businesses)
    //   }
    // },

    listen () {
      Bus.$on('businesses:setCurrentBusiness', payload => {
        this.selectBusinessToBrowse(payload.business)

        if (payload.redirectTo) {
          this.$router.push(payload.redirectTo)
        }
      })
    },

    selectBusinessToBrowse (value) {
      if (!(value instanceof BusinessRecord)) {
        throw TypeError(`businesses:selectBusinessToBrowse: expects instance of BusinessRecord, got ${value}`)
      }

      if (this.businessToBrowse.name === value.name) {
        return
      }

      this.SELECT_BUSINESS_TO_BROWSE(value._record)

      // erase movements list
      this.$store.commit('movements-history/SET_MOVEMENTS', [])
    },

    initRouterHooks () {
      this.$router.beforeEach((to, from, next) => {
        if (this.isAccountCorporate && !this.isCustomerUiShown) {
          next()
          return
        }

        if (
          to.name === vueRoutes.businesses.name ||
          to.name === vueRoutes.allBusinesses.name
        ) {
          this.CLEAR_BUSINESS_TO_BROWSE()
          next()
        } else if (!ROUTES_WITH_OWNER_FILTER.includes(to.name)) {
          next()
        } else if (!this.businessToBrowse.accountId) {
          next(vueRoutes.businesses)
        } else if (!to.query.owner) {
          to.query.owner = this.businessToBrowse.accountId
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
.current-business-indicator__browsing-lbl {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 0.8rem;
}

.current-business-indicator__attrs {
  display: flex;
  flex-direction: row;
  align-items: center;
  max-width: 100%;
}

.current-business-indicator__name {
  font-size: 1.6rem;
  font-weight: 700;
  margin-left: 1.6rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.current-business-indicator__link-hidden {
  display: none !important; /* stylelint-disable-line */
}
</style>
