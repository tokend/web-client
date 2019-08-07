<template>
  <div class="customers-converted-balances">
    <span>
      {{ balance | formatMoney }}
      {{ defaultQuoteAsset }}
    </span>
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
    }
  },

  computed: {
    ...mapGetters({
      accountId: vuexTypes.accountId,
      defaultQuoteAsset: vuexTypes.defaultQuoteAsset,
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
      const balanceStates = await this.getCustomerBalances()
      // eslint-disable-next-line max-len
      const convertedBalance = balanceStates.reduce((latestBalance, balance) => {
        return MathUtil.add(
          latestBalance,
          balance.convertedAmounts.available
        )
      }, 0)
      this.balance = convertedBalance
    },

    async getCustomerBalances () {
      try {
        const endpoint = `/v3/accounts/${this.customerAccountId}/converted_balances/${this.defaultQuoteAsset}`
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
