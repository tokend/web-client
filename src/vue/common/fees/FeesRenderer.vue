<template>
  <div class="fees-renderer">
    <p
      v-if="feesCollection.isExternalFeePresent"
      class="fees-renderer__network-fee"
    >
      <span class="fees-renderer__network-fee-text">
        {{ 'fees-renderer.network-fee-msg' | globalize }}
      </span>

      <span class="fees-renderer__network-fee-text">
        {{ 'fees-renderer.network-fee-unknown-msg' | globalize }}
      </span>
    </p>

    <div
      v-for="(fee, i) in feesCollection.fees"
      :key="i"
      class="fees-renderer__fee-block"
    >
      <fee-viewer
        :fee="fee"
        :asset-code="feesCollection.assetCode"
      />
    </div>

    <div class="fees-renderer__view-fees-link-wrp">
      <router-link
        class="fees-renderer__view-fees-link"
        :to="vueRoutes.fees"
        target="_blank"
        rel="noopener"
      >
        {{
          'fees-renderer.view-fees-link' | globalize
        }}<i class="mdi mdi-open-in-new fees-renderer__view-icon" />
      </router-link>
    </div>

    <div
      v-if="feesCollection.destinationFee"
      class="fees-renderer__tick-field"
    >
      <tick-field
        :value="paidForDestination"
        @input="updatePaidForDestination"
      >
        {{ 'fees-renderer.pay-for-recipient-lbl' | globalize }}
      </tick-field>
    </div>
  </div>
</template>

<script>
import TickField from '@/vue/fields/TickField'
import FeeViewer from './FeeViewer'

import { FeesCollection } from './fees-collection'

import { vueRoutes } from '@/vue-router/routes'

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
    feesCollection: { type: FeesCollection, required: true },
    paidForDestination: { type: Boolean, default: false },
  },

  data: _ => ({
    vueRoutes,
  }),

  methods: {
    updatePaidForDestination (value) {
      this.feesCollection.isPaidForDestination = value
      this.$emit(EVENTS.updatePaidForDestination, value)
    },
  },
}
</script>

<style lang="scss">
@import '@/scss/variables';

.fees-renderer {
  width: 100%;
}

.fees-renderer__tick-field {
  margin-top: 2rem;
}

.fees-renderer__network-fee {
  display: flex;
  justify-content: space-between;
}

.fees-renderer__network-fee-text {
  font-size: 1.4rem;
}

.fees-renderer__network-fee,
.fees-renderer__fee-block {
  margin-bottom: 1rem;
}

.fees-renderer__view-fees-link {
  margin-bottom: 0.6rem;
  color: $col-link;
  font-size: 1.4rem;
}

.fees-renderer__view-icon {
  display: inline-block;
  margin-left: 0.5ch;
}
</style>
