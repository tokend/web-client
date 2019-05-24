<template>
  <div class="fees-renderer">
    <!-- currently disabled -->
    <!-- <tr
      v-if="false"
      class="fees-renderer__strong"
    >
      <td>{{ 'fees-renderer.network-fee-lbl' | globalize }}</td>
      <td>{{ 'fees-renderer.network-fee-unknown-lbl' | globalize }}</td>
    </tr> -->
    <div
      v-for="(fee, i) in fees.fees"
      :key="i"
    >
      <fee-viewer
        class="fees-renderer__fee-block"
        :fee="fee"
        :asset-code="fees.assetCode"
      />
    </div>

    <div
      v-if="fees.destinationFee"
      class="fees-renderer__tick-field"
    >
      <tick-field
        :value="paidForDestination"
        @input="updatePaidForDestination"
      >
        {{ 'fees-renderer.pay-fees-for-recipient-lbl' | globalize }}
      </tick-field>
    </div>
  </div>
</template>

<script>
import TickField from '@/vue/fields/TickField'
import FeeViewer from './FeeViewer'

import { FeesCollection } from './fees-collection'

const EVENTS = {
  updatePaidForDestination: 'update:paidForDestination',
}

export default {
  name: 'fees-renderer',
  components: {
    TickField,
    FeeViewer,
  },

  props: {
    fees: { type: FeesCollection, required: true },
    paidForDestination: { type: Boolean, default: false },
  },

  methods: {
    updatePaidForDestination (value) {
      this.fees.isPaidForDestination = value
      this.$emit(EVENTS.updatePaidForDestination, value)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/scss/variables';

.fees-renderer__tick-field {
  margin-top: 2rem;
}

.fees-renderer__strong {
  font-weight: 600;
  color: $col-text;
}

.fees-renderer__fee-block {
  margin-bottom: 1rem;
}
</style>
