<template>
  <div class="loyalty-points-statistics">
    <div class="loyalty-points-statistics__overall">
      <div class="loyalty-points-statistics_viewer">
        <h3 class="loyalty-points-statistics_viewer-title">
          {{ 'loyalty-points-statistics.payable-receivable-title' | globalize }}
        </h3>
        <payable-receivable-viewer />
      </div>

      <div class="loyalty-points-statistics_viewer">
        <h3 class="loyalty-points-statistics_viewer-title">
          <!-- eslint-disable-next-line max-len -->
          {{ 'loyalty-points-statistics.receivable-distribution-title' | globalize }}
        </h3>
        <receivable-distribution-viewer />
      </div>
    </div>

    <div class="loyalty-points-statistics__overtimes">
      <div class="loyalty-points-statistics_viewer">
        <h3 class="loyalty-points-statistics_viewer-title">
          {{
            'loyalty-points-statistics.receivable-overtime-title' | globalize
          }}
        </h3>
        <receivable-overtime-viewer />
      </div>

      <div class="loyalty-points-statistics_viewer">
        <h3 class="loyalty-points-statistics_viewer-title">
          {{ 'loyalty-points-statistics.payable-overtime-title' | globalize }}
        </h3>
        <payable-overtime-viewer />
      </div>
    </div>
  </div>
</template>

<script>
import PayableReceivableViewer from './components/viewers/payable-receivable-viewer'
import ReceivableDistributionViewer from './components/viewers/receivable-distribution-viewer'
import ReceivableOvertimeViewer from './components/viewers/receivable-overtime-viewer'
import PayableOvertimeViewer from './components/viewers/payable-overtime-viewer'

import { initApi } from './_api'

import { Wallet } from '@tokend/js-sdk'

export default {
  name: 'loyalty-points-statistics-module',
  components: {
    PayableReceivableViewer,
    ReceivableDistributionViewer,
    ReceivableOvertimeViewer,
    PayableOvertimeViewer,
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

  async created () {
    initApi(this.wallet, this.config)
  },
}
</script>

<style lang="scss" scoped>
@import "~@scss/mixins";

.loyalty-points-statistics__overall,
.loyalty-points-statistics__overtimes {
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

.loyalty-points-statistics__overtimes {
  margin-top: 2rem;
}

.loyalty-points-statistics_viewer-title {
  margin-bottom: 1.6rem;
  font-size: 2.2rem;
  text-align: center;
}
</style>
