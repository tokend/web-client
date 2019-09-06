<template>
  <div class="customers-converted-balances">
    <template v-if="isLoaded && isCanConvertBalances && isSmallBalance">
      <span :title="balance | formatMoney">
        {{ balance | formatBalance }}
        {{ businessStatsQuoteAsset }}
      </span>
    </template>
    <template v-else>
      &mdash;
    </template>
  </div>
</template>

<script>
import { api } from '@/api'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import { MathUtil } from '@/js/utils'
import { Bus } from '@/js/helpers/event-bus'
import { TEN_MILLION } from '@/js/const/amounts.const'

export default {
  name: 'customers-converted-balances',

  props: {
    customerAccountId: {
      type: String,
      required: true,
    },
  },

  data () {
    return {
      balance: 0,
      balanceStates: [],
      isLoaded: false,
    }
  },

  computed: {
    ...mapGetters({
      accountId: vuexTypes.accountId,
      businessStatsQuoteAsset: vuexTypes.businessStatsQuoteAsset,
    }),

    isCanConvertBalances () {
      const convertedBalances = this.balanceStates
        .reduce((numberOfConvertedBalances, balance) => {
          return balance.isConverted
            ? ++numberOfConvertedBalances
            : numberOfConvertedBalances
        }, 0)
      return convertedBalances > 0
    },

    isSmallBalance () {
      return this.balance < TEN_MILLION
    },
  },

  async created () {
    await this.loadAndCalculateBalances()
    this.isLoaded = true

    Bus.on('customers:updateList', async () => {
      await this.loadAndCalculateBalances()
    })
  },

  methods: {
    async calculateConvertedBalances () {
      if (this.isCanConvertBalances) {
        this.balance = this.balanceStates
          .reduce((latestBalance, balance) => {
            return MathUtil.add(
              latestBalance,
              balance.convertedAmounts.available
            )
          }, 0)
      }
    },

    async getCustomerBalances () {
      try {
        const endpoint = `/v3/accounts/${this.customerAccountId}/converted_balances/${this.businessStatsQuoteAsset}`
        const { data } = await api.getWithSignature(endpoint, {
          filter: {
            asset_owner: this.accountId,
          },
          include: ['states', 'balance', 'balance.state', 'balance.asset'],
        })

        this.balanceStates = data.states
      } catch (e) {
        console.error(e)
      }
    },

    async loadAndCalculateBalances () {
      await this.getCustomerBalances()
      await this.calculateConvertedBalances()
    },
  },
}
</script>
