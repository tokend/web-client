<template>
  <div class="current-business-indicator">
    <template v-if="currentBusiness.accountId">
      <div class="current-business-indicator__inner">
        <div class="current-business-indicator__browsing-lbl">
          {{ 'current-business-indicator.browsing-lbl' | globalize }}
        </div>

        <div class="current-business-indicator__attrs">
          <current-business-logo
            class="current-business-indicator__logo"
            :business="currentBusiness"
          />

          <p class="current-business-indicator__name">
            {{ currentBusiness.name }}
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
import { BusinessRecord } from '@/vue/pages/businesses-all/business.record'
import { Bus } from '@/js/helpers/event-bus'
import { vueRoutes } from '@/vue-router/routes'
import CurrentBusinessLogo from './current-business-logo'

const ROUTES_WITH_OWNER_FILTER = [
  vueRoutes.movements.name,
  vueRoutes.assets.name,
  vueRoutes.balances.name,
  vueRoutes.assetsExplore.name,
  vueRoutes.sales.name,
  vueRoutes.investableSales.name,
  vueRoutes.userOwnedSales.name,
  vueRoutes.polls.name,
  vueRoutes.allPolls.name,
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

  data () {
    return {
      currentBusiness: new BusinessRecord({}),
    }
  },

  created () {
    this.checkCurrentRouteAccessible()
    this.listen()
    this.initRouterHooks()
    this.hideUnreachable()
  },

  methods: {
    checkCurrentRouteAccessible () {
      if (
        ROUTES_WITH_OWNER_FILTER.includes(this.$route.name) &&
        !this.currentBusiness.accountId
      ) {
        this.$router.push(vueRoutes.businesses, () => {
          this.hideUnreachable()
          setTimeout(() => this.hideUnreachable(), 50)
          setTimeout(() => this.hideUnreachable(), 150)
          setTimeout(() => this.hideUnreachable(), 250)
        })
      }
    },

    listen () {
      Bus.$on('businesses:setCurrentBusiness', payload => {
        this.setCurrentBusiness(payload.business)

        this.hideUnreachable()
        if (payload.redirectTo) {
          this.$router.push(payload.redirectTo)
        }
      })
    },

    setCurrentBusiness (value) {
      if (!(value instanceof BusinessRecord)) {
        throw TypeError(`businesses:setCurrentBusiness: expects instance of BusinessRecord, got ${value}`)
      }

      if (this.currentBusiness.name === value.name) {
        return
      }

      this.currentBusiness = value

      // erase movements list
      this.$store.commit('movements-history/SET_MOVEMENTS', [])
    },

    initRouterHooks () {
      this.$router.beforeEach((to, from, next) => {
        if (!ROUTES_WITH_OWNER_FILTER.includes(to.name)) {
          next()
        } else if (!this.currentBusiness.accountId) {
          next(vueRoutes.businesses)
        } else if (!to.query.owner) {
          to.query.owner = this.currentBusiness.accountId
          next(to)
        } else {
          next()
        }
      })

      this.$router.afterEach(() => {
        this.hideUnreachable()
      })
    },

    hideUnreachable () {
      document.querySelectorAll('.sidebar__link').forEach(item => {
        const routeEntry = this.routeByPath(item.getAttribute('href'))
        if (
          ROUTES_WITH_OWNER_FILTER.includes(routeEntry.name) &&
          !this.currentBusiness.accountId
        ) {
          item.classList.add('current-business-indicator__link-hidden')
        } else {
          item.classList.remove('current-business-indicator__link-hidden')
        }
      })
    },

    routeByPath (routePath) {
      return this.$router.options.routes
        .find(i => i.name === 'app').children
        .find(i => i.path === routePath)
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
