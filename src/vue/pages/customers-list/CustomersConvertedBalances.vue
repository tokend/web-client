<template>
  <div class="customers-converted-balances">
    <template v-if="isConvertedBalances">
      <span>
        {{ balance | formatMoney }}
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
      balanceStates: [],
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
    await this.loadAndCalculateBalances()

    Bus.on('customers:updateList', async () => {
      await this.loadAndCalculateBalances()
    })
  },

  methods: {
    async calculateConvertedBalances () {
      this.checkConvertedBalances()

      let convertedBalance = 0
      if (this.isConvertedBalances) {
        convertedBalance = this.balanceStates
          .reduce((latestBalance, balance) => {
            return MathUtil.add(
              latestBalance,
              balance.convertedAmounts.available
            )
          }, 0)
      }
      this.balance = convertedBalance
    },

    checkConvertedBalances () {
      let convertedBalances = 0
      this.balanceStates.forEach(balance => {
        if (balance.isConverted) {
          convertedBalances++
        }
      })
      this.isConvertedBalances = convertedBalances > 0
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
