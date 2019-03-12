<template>
  <div>
    <asset-sale-form
      :account-id="accountId"
      @close="$emit(EVENTS.close)"
    />
  </div>
</template>

<script>
import AssetSaleForm from './components/create-asset-sale-form'

import { Wallet } from '@tokend/js-sdk'
import { initApi } from './_api'

const EVENTS = {
  close: 'close',
}

export default {
  name: 'asset-sale',
  components: {
    AssetSaleForm,
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
    accountId: {
      type: String,
      required: true,
    },
  },
  data: _ => ({
    EVENTS
  }),
  async created () {
    initApi(this.wallet, this.config)
  },
}
</script>

<style lang="scss" scoped>
</style>
