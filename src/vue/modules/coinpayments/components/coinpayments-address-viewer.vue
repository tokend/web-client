<template>
  <div>
    <p class="address-viewer__help-msg">
      {{ 'coinpayments-deposit.address-ready-msg' | globalize({
        amount: depositDetails.amount,
        money: asset.code
      }) }}
    </p>
    <key-viewer :value="depositDetails.address" />
    <timeout-ticker
      :timeout="+depositDetails.timeout"
    />
  </div>
</template>

<script>
import KeyViewer from '@/vue/common/KeyViewer'
import TimeoutTicker from './coinpayments-timeout-ticker'

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
}
</script>

<style lang="scss" scoped>
  .address-viewer__help-msg {
    margin-bottom: 2rem;
  }
</style>
