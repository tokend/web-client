<template>
  <div>
    <p class="address-viewer__help">
      {{ 'coinpayments.ready-cp' | globalize({
        amount: formatMoney(depositDetails.amount),
        asset: asset.code
      }) }}
    </p>
    <key-viewer :value="depositDetails.address" />
    <timeout-ticker
      class="deposit__timeout-ticker"
      :timeout="+depositDetails.timeout"
    />
  </div>
</template>

<script>
import KeyViewer from '@/vue/common/KeyViewer'
import TimeoutTicker from './coinpayments-timeout-ticker'

import { formatMoney } from '@/vue/filters/formatMoney'

export default {
  name: 'address-viewer',
  components: {
    KeyViewer,
    TimeoutTicker,
  },
  props: {
    depositDetails: { type: Object, required: true },
    asset: { type: Object, required: true },
  },
  methods: {
    formatMoney,
  },
}
</script>

<style lang="scss" scoped>
  .address-viewer__help {
    margin-bottom: 2rem;
  }
</style>
