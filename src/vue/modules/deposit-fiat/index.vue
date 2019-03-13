<template>
  <div class="deposit-fiat-module">
    <tabs>
      <tab
        :name="'deposit-fiat-module.tab-card-lbl' | globalize"
        id="deposit-fiat-card-tab"
      >
        <deposit-fiat-card
          :config="config"
          :wallet="wallet"
          @deposited="deposited"
        />
      </tab>
      <tab
        :name="'deposit-fiat-module.tab-bank-lbl' | globalize"
        id="deposit-fiat-bank-tab"
      >
        <deposit-fiat-bank
          :config="config"
          :wallet="wallet"
          @deposited="deposited"
        />
      </tab>
    </tabs>
  </div>
</template>

<script>
import { Wallet } from '@tokend/js-sdk'

import Tabs from '@/vue/common/tabs/Tabs'
import Tab from '@/vue/common/tabs/Tab'

import DepositFiatBank from '@modules/deposit-fiat-bank'
import DepositFiatCard from '@modules/deposit-fiat-card'

const EVENTS = {
  deposited: 'deposited',
}

export default {
  name: 'deposit-fiat-module',
  components: {
    Tabs,
    Tab,
    DepositFiatBank,
    DepositFiatCard,
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
     */
    config: {
      type: Object,
      required: true,
    },
  },
  methods: {
    deposited () {
      this.$emit(EVENTS.deposited)
    },
  },
}
</script>

<style lang="scss">
</style>
