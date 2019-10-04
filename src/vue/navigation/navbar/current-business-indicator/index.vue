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
          <div>
            <p class="current-business-indicator__name">
              {{ businessToBrowse.name }}
            </p>
            <p
              class="current-business-indicator__industry"
              v-if="businessToBrowse.industry"
            >
              {{ businessToBrowse.industry }}
            </p>
          </div>
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
import CurrentBusinessLogo from './current-business-logo'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { vuexTypes } from '@/vuex'

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
    this.listen()
  },

  methods: {
    ...mapMutations([
      vuexTypes.SELECT_BUSINESS_TO_BROWSE,
      vuexTypes.CLEAR_BUSINESS_TO_BROWSE,
      vuexTypes.SET_BUSINESS_STATS_QUOTE_ASSET,
    ]),

    ...mapActions([
      vuexTypes.LOAD_BUSINESS_STATS_QUOTE_ASSET,
    ]),

    listen () {
      Bus.$on('businesses:setCurrentBusiness', async (payload) => {
        this.selectBusinessToBrowse(payload.business)

        if (payload.redirectTo) {
          await this.$router.push(payload.redirectTo)
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
      this.SET_BUSINESS_STATS_QUOTE_ASSET(value._record.statsQuoteAsset)
      this.SELECT_BUSINESS_TO_BROWSE(value._record)
      // erase movements list
      this.$store.commit('SET_MOVEMENTS', [])
    },
  },
}
</script>

<style lang="scss">
@import '~@scss/variables';

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

.current-business-indicator__industry {
  margin-left: 1.6rem;
  margin-top: 0.4rem;
  font-size: 1.2rem;
  color: $col-sale-details-subtitle;
  word-wrap: break-word;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
