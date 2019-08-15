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
    <clipboard-field
      v-if="payload"
      :value="payload"
      :label="'coinpayments-deposit.payload-lbl' | globalize"
    />
    <div
      class="address-viewer__timeout-ticker-wrp"
      v-if="endTime"
    >
      <timeout-ticker :end-time="endTime" />
    </div>
  </div>
</template>

<script>
import KeyViewer from '@/vue/common/KeyViewer'
import TimeoutTicker from '@/vue/common/TimeoutTicker'
import ClipboardField from '@/vue/fields/ClipboardField'

export default {
  name: 'address-viewer',
  components: {
    KeyViewer,
    TimeoutTicker,
    ClipboardField,
  },
  props: {
    assetCode: { type: String, required: true },
    address: { type: String, required: true },
    payload: { type: String, default: '' },
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
