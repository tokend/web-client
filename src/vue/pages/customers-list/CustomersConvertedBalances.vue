<template>
  <div class="customers-converted-balances">
    <template v-if="isConvertedBalances">
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
      balance: '',
      isConvertedBalances: false,
    }
  },

  computed: {
    ...mapGetters({
      accountId: vuexTypes.accountId,
      businessStatsQuoteAsset: vuexTypes.businessStatsQuoteAsset,
    }),
  },

  async created () {
    await this.calculateConvertedBalances()
    Bus.on('customers:updateList', () => {
      this.calculateConvertedBalances()
    })
  },

  methods: {
    async calculateConvertedBalances () {
      let notConvertedBalances = 0
      const balanceStates = await this.getCustomerBalances()
      const convertedBalance = balanceStates
        .reduce((latestBalance, balance) => {
          if (!balance.isConverted) {
            notConvertedBalances++
          }
          return MathUtil.add(
            latestBalance,
            balance.convertedAmounts.available
          )
        }, 0)
      this.isConvertedBalances = notConvertedBalances !== balanceStates.length
      this.balance = convertedBalance
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

        return data.states
      } catch (e) {
        console.error(e)
      }
    },
  },
}
</script>
