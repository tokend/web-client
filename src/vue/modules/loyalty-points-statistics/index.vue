<template>
  <div class="loyalty-points-statistics">
    <div class="loyalty-points-statistics__withdrawals">
      <div class="loyalty-points-statistics_viewer">
        <h3 class="loyalty-points-statistics_viewer-title">
          {{ 'loyalty-points.statistics.withdrawals-title' | globalize }}
        </h3>
        <withdrawals-viewer />
      </div>

      <div class="loyalty-points-statistics_viewer">
        <h3 class="loyalty-points-statistics_viewer-title">
          {{
            'loyalty-points.statistics.withdrawal-requests-title' | globalize
          }}
        </h3>
        <withdrawal-requests-viewer />
      </div>
    </div>

    <div class="loyalty-points-statistics__volumes">
      <div class="loyalty-points-statistics_viewer">
        <h3 class="loyalty-points-statistics_viewer-title">
          {{ 'loyalty-points.statistics.incoming-volume-title' | globalize }}
        </h3>
        <incoming-volume-viewer />
      </div>

      <div class="loyalty-points-statistics_viewer">
        <h3 class="loyalty-points-statistics_viewer-title">
          {{ 'loyalty-points.statistics.summary-volume-title' | globalize }}
        </h3>
        <summary-volume-viewer />
      </div>
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

<style lang="scss" scoped>
@import "~@scss/mixins";

.loyalty-points-statistics__withdrawals,
.loyalty-points-statistics__volumes {
  display: flex;
  flex-wrap: wrap;
  margin: -2rem;
}

.loyalty-points-statistics_viewer {
  margin: 2rem;
  flex: 0 1 calc(50% - 4rem);
  min-height: 100%;

  @include respond-to-custom($x-medium) {
    flex: 0 1 calc(100% - 4rem);
  }
}

.loyalty-points-statistics__volumes {
  margin-top: 2rem;
}

.loyalty-points-statistics_viewer-title {
  margin-bottom: 3.2rem;
  font-size: 2.2rem;
  text-align: center;
}
</style>
