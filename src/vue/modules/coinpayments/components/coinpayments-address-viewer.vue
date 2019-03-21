<template>
  <div>
    <p class="address-viewer__help-msg">
      {{ 'coinpayments-deposit.address-ready-msg' | globalize({
        amount: amount,
        money: assetCode
      }) }}
    </p>
    <key-viewer :value="address" />
    <timeout-ticker :end-time="endTime" />
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
    assetCode: { type: String, required: true },
    address: { type: String, required: true },
    amount: { type: [String, Number], required: true },
    endTime: { type: [Number], required: true }, // timeStamp
  },
}
</script>

<style lang="scss" scoped>
  .address-viewer__help-msg {
    margin-bottom: 2rem;
  }
</style>
