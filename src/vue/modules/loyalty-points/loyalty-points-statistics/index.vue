<template>
  <div class="loyalty-points-statistics">
    <div class="loyalty-points-statistics__overall">
      <div class="loyalty-points-statistics__viewer">
        <h3 class="loyalty-points-statistics__viewer-title">
          <!-- eslint-disable-next-line max-len -->
          {{ 'loyalty-points-statistics.receivable-distribution-title' | globalize }}
        </h3>
        <receivable-distribution-viewer />
      </div>

      <div class="loyalty-points-statistics__viewer">
        <h3 class="loyalty-points-statistics__viewer-title">
          <!-- eslint-disable-next-line max-len -->
          {{ 'loyalty-points-statistics.payable-distribution-title' | globalize }}
        </h3>
        <payable-distribution-viewer />
      </div>
    </div>

    <div class="loyalty-points-statistics__overtimes">
      <div class="loyalty-points-statistics__viewer">
        <h3 class="loyalty-points-statistics__viewer-title">
          {{
            'loyalty-points-statistics.receivable-overtime-title' | globalize
          }}
        </h3>
        <receivable-overtime-viewer />
      </div>

      <div class="loyalty-points-statistics__viewer">
        <h3 class="loyalty-points-statistics__viewer-title">
          {{ 'loyalty-points-statistics.payable-overtime-title' | globalize }}
        </h3>
        <payable-overtime-viewer />
      </div>
    </div>

    <div class="loyalty-points-statistics__overall">
      <div class="loyalty-points-statistics__viewer">
        <h3 class="loyalty-points-statistics__viewer-title">
          {{ 'loyalty-points-statistics.receivable-payable-title' | globalize }}
        </h3>
        <receivable-payable-viewer />
      </div>
    </div>
  </div>
</template>

<script>
import ReceivablePayableViewer from './components/viewers/receivable-payable-viewer'
import ReceivableDistributionViewer from './components/viewers/receivable-distribution-viewer'
import PayableDistributionViewer from './components/viewers/payable-distribution-viewer'
import ReceivableOvertimeViewer from './components/viewers/receivable-overtime-viewer'
import PayableOvertimeViewer from './components/viewers/payable-overtime-viewer'

export default {
  name: 'loyalty-points-statistics-module',
  components: {
    ReceivablePayableViewer,
    PayableDistributionViewer,
    ReceivableDistributionViewer,
    ReceivableOvertimeViewer,
    PayableOvertimeViewer,
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';

.loyalty-points-statistics__overall,
.loyalty-points-statistics__overtimes {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -2rem;
}

.loyalty-points-statistics__viewer {
  margin: 2rem;
  flex: 0 1 calc(50% - 5rem);
  min-height: 100%;

  &:only-child {
    flex: 1;
    max-width: 75rem;
    margin: auto;
  }

  @include respond-to-custom($x-medium) {
    flex: 0 1 calc(100% - 4rem);
  }
}

.loyalty-points-statistics__overtimes {
  margin-top: 2rem;
}

.loyalty-points-statistics__viewer-title {
  margin-bottom: 1.6rem;
  font-size: 2.2rem;
  text-align: center;
}
</style>
