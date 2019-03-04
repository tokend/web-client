<template>
  <div>
    <p class="address-viewer__help">
      {{ 'coinpayments-form.ready-cp' | globalize({
        amount: formatMoney(asset.amount),
        asset: asset.asset
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
  name: '',
  components: {
    KeyViewer,
    TimeoutTicker,
  },
  mixins: [],
  props: {
    depositDetails: { type: Object, required: true },
    asset: { type: Object, required: true },
  },
  data () {
    return {}
  },
  computed: {
  },
  watch: {},
  created () {
  },
  destroyed () {
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
