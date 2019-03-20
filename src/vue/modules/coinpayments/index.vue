<template>
  <div class="coinpayments">
    <coinpayments-form
      :asset="asset"
      :balance-details="balanceDetails"
    />
    <div class="coinpayments__deposit-list-wrp">
      <deposit-list
        :balance-id="balanceDetails.id"
      />
    </div>
  </div>
</template>

<script>
import CoinpaymentsForm from './components/coinpayments-form'
import DepositList from './components/coinpayments-deposit-list'

import { Wallet } from '@tokend/js-sdk'
import { initApi } from './_api'

export default {
  name: 'coinpayments',
  components: {
    CoinpaymentsForm,
    DepositList,
  },
  props: {
    wallet: {
      type: Wallet,
      required: true,
    },
    /**
     * @property config - the config for component to use
     * @property config.horizonURL - the url of horizon server (without version)
     */
    config: {
      type: Object,
      required: true,
    },
    asset: { type: Object, required: true },
    balanceDetails: { type: Object, required: true },
    accountId: { type: String, required: true },
  },
  created () {
    initApi(this.wallet, this.config)
  },
}
</script>

<style lang="scss" scoped>
  .coinpayments__address-viewer-wrp {
    margin-top: 5rem;
  }

  .coinpayments__deposit-list-wrp {
    width: 100%;
    max-width: 100%;
    margin-top: 5rem;
  }
</style>
