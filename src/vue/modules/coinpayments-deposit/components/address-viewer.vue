<template>
  <div>
    <p class="address-viewer__help-msg">
      {{ 'coinpayments-deposit.address-ready-msg' | globalize({
        amount: {
          value: amount, currency: assetCode
        }
      }) }}
    </p>
    <key-viewer
      :value="address"
      :label="'coinpayments-deposit.address-lbl' | globalize"
    />
    <div class="address-viewer__timeout-ticker-wrp">
      <timeout-ticker :end-time="endTime" />
    </div>
  </div>
</template>

<script>
import KeyViewer from '@/vue/common/KeyViewer'
import TimeoutTicker from './timeout-ticker'

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
    endTime: { type: [Number], required: true }, // unix timeStamp
  },
}
</script>

<style lang="scss" scoped>
  .address-viewer__help-msg {
    margin-bottom: 2rem;
  }

  .address-viewer__timeout-ticker-wrp {
    margin-top: 1rem;
  }
</style>
