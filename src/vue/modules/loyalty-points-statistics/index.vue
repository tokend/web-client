<template>
  <div class="loyalty-points-statistics">
    <div class="loyalty-points-statistics__withdrawals">
      <withdrawals-viewer />
      <withdrawal-requests-viewer />
    </div>

    <div class="loyalty-points-statistics__volumes">
      <incoming-volume-viewer />
      <summary-volume-viewer />
    </div>
  </div>
</template>

<script>
import WithdrawalsViewer from './components/viewers/withdrawals-viewer'
import WithdrawalRequestsViewer from './components/viewers/withdrawal-requests-viewer'
import IncomingVolumeViewer from './components/viewers/incoming-volume-viewer'
import SummaryVolumeViewer from './components/viewers/summary-volume-viewer'

import { initApi } from './_api'

import { Wallet } from '@tokend/js-sdk'

export default {
  name: 'loyalty-points-statistics-module',
  components: {
    WithdrawalsViewer,
    WithdrawalRequestsViewer,
    IncomingVolumeViewer,
    SummaryVolumeViewer,
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
  },

  data: _ => ({
    isLoaded: false,
  }),

  async created () {
    initApi(this.wallet, this.config)
  },
}
</script>
