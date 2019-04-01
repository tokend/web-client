<template>
  <div class="withdrawal-fiat-module">
    <tabs>
      <tab
        :name="'withdrawal-fiat-module.tab-card-lbl' | globalize"
        id="withdrawal-fiat-card-tab"
      >
        <withdrawal-fiat-card
          :config="config"
          :wallet="wallet"
          @withdrawn="withdrawn"
        />
      </tab>
      <tab
        :name="'withdrawal-fiat-module.tab-bank-lbl' | globalize"
        id="withdrawal-fiat-bank-tab"
      >
        <withdrawal-fiat-bank
          :config="config"
          :wallet="wallet"
          @withdrawn="withdrawn"
        />
      </tab>
    </tabs>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from 'vuex'
import { types } from './store/types'

import { Wallet } from '@tokend/js-sdk'
import { initApi } from './_api'

import Tabs from '@/vue/common/tabs/Tabs'
import Tab from '@/vue/common/tabs/Tab'

import WithdrawalFiatBank from '@modules/withdrawal-fiat-bank'
import WithdrawalFiatCard from '@modules/withdrawal-fiat-card'

const EVENTS = {
  withdrawn: 'withdrawn',
}

export default {
  name: 'withdrawal-fiat-module',
  components: {
    Tabs,
    Tab,
    WithdrawalFiatBank,
    WithdrawalFiatCard,
  },
  props: {
    wallet: {
      type: Wallet,
      required: true,
    },
    /**
     * @property config - the config for component to use
     * @property config.horizonURL - the url of horizon server (without version)
     * @property config.decimalPoints - count of allowed decimal points
     * @property config.minAmount - minimal allowed amount
     */
    config: {
      type: Object,
      required: true,
    },
  },
  data: _ => ({
    isInitialized: false,
  }),
  computed: {
    ...mapGetters('withdrawal-fiat', {
      balances: types.balances,
    }),
  },
  async created () {
    initApi(this.wallet, this.config)

    this.setAccountId(this.wallet.accountId)
    await this.loadBalances()
    this.isInitialized = true
  },
  methods: {
    ...mapMutations('withdrawal-fiat', {
      setAccountId: types.SET_ACCOUNT_ID,
    }),
    ...mapActions('withdrawal-fiat', {
      loadBalances: types.LOAD_BALANCES,
    }),
    withdrawn () {
      this.$emit(EVENTS.withdrawn)
    },
  },
}
</script>

<style lang="scss">
</style>
