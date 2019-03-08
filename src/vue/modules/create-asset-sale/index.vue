<template>
  <div>
    <asset-sale-form
      :account-id="accountId"
    />
  </div>
</template>

<script>
import AssetSaleForm from './components/create-asset-sale-form'

import { mapActions, mapMutations, mapGetters } from 'vuex'
// import { ErrorHandler } from '@/js/helpers/error-handler'
// import { types } from './store/types'

import { Wallet } from '@tokend/js-sdk'
import { initApi } from './_api'

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
  }),
  computed: {
    ...mapGetters('movements-history', {
    }),
  },
  async created () {
    initApi(this.wallet, this.config)
  },
  methods: {
    ...mapMutations('movements-history', {
    }),
    ...mapActions('movements-history', {
    }),
  },
}
</script>

<style lang="scss" scoped>
</style>
