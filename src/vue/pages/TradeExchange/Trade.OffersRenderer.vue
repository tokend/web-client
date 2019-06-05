<template>
  <div class="trade-offers">
    <h3 class="app__table-title trade-offers__title">
      <template v-if="isBuy">
        {{ 'trade-offers.subtitle-ask' | globalize }}
      </template>
      <template v-else>
        {{ 'trade-offers.subtitle-bid' | globalize }}
      </template>
    </h3>
    <div
      class="trade-offers-wrapper"
    >
      <template>
        <div
          class="app__table
                app__table--with-shadow
                app__table--clickable-rows"
        >
          <table>
            <thead>
              <tr>
                <th>
                  <!-- eslint-disable-next-line -->
                  {{ 'trade-offers.table-want-lbl' | globalize({ asset: assetPair.base }) }}
                </th>
                <th>
                  <!-- eslint-disable-next-line -->
                  {{ 'trade-offers.table-offer-lbl' | globalize({ asset: assetPair.quote }) }}
                </th>
                <th>
                  <!-- eslint-disable-next-line -->
                  {{ 'trade-offers.table-price-lbl' | globalize({ asset: assetPair.quote }) }}
                </th>
              </tr>
            </thead>
            <tbody
              v-if="offersList.length && !isLoading"
            >
              <tr
                v-for="(offer, o) in offersList"
                :key="`trade-offers-row-${o}`"
                @click="selectOffer(offer)"
                :disabled="offer.ownerId === accountId">
                <td>{{ offer.baseAmount | formatMoney }}</td>
                <td>{{ offer.quoteAmount | formatMoney }}</td>
                <td>{{ offer.price | formatMoney }}</td>
              </tr>
            </tbody>
            <empty-tbody-placeholder
              v-else-if="!offersList.length && !isLoading"
              :message="'trade-offers.no-data-title' | globalize"
              :colspan="3"
            />
            <skeleton-loader-table-body
              v-else-if="isLoading"
              :cells="3"
            />
          </table>
        </div>
      </template>
    </div>
    <drawer :is-shown.sync="isSubmitOfferDrawerShown">
      <template slot="heading">
        <template v-if="isBuy">
          {{ 'trade-offers.submit-ask-offer-title' | globalize }}
        </template>
        <template v-else>
          {{ 'trade-offers.submit-bid-offer-title' | globalize }}
        </template>
      </template>
      <submit-trade-offer-form
        :is-buy="!isBuy"
        :asset-pair="assetPair"
        :offer="selectedOffer"
        @offer-submitted="closeDrawer"
      />
    </drawer>
  </div>
</template>

<script>
import SubmitTradeOfferForm from '@/vue/forms/market-orders/SubmitTradeOfferForm'

import FormMixin from '@/vue/mixins/form.mixin'
import Drawer from '@/vue/common/Drawer'
import { vuexTypes } from '@/vuex'
import { mapGetters } from 'vuex'
import SkeletonLoaderTableBody from '@/vue/common/skeleton-loader/SkeletonLoaderTableBody'
import EmptyTbodyPlaceholder from '@/vue/common/EmptyTbodyPlaceholder'

const EVENTS = {
  reloadTrades: 'reload-trades',
}

export default {
  name: 'trade-offers-renderer',
  components: {
    Drawer,
    SubmitTradeOfferForm,
    SkeletonLoaderTableBody,
    EmptyTbodyPlaceholder,
  },
  mixins: [
    FormMixin,
  ],
  props: {
    assetPair: {
      type: Object,
      required: true,
      default: () => ({ base: '', quote: '' }),
    },
    isLoading: {
      type: Boolean, required: true,
    },
    isBuy: {
      type: Boolean,
      required: true,
    },
    offersList: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    isSubmitOfferDrawerShown: false,
    selectedOffer: {},
  }),
  computed: {
    ...mapGetters([
      vuexTypes.accountId,
    ]),
    noDataMessage () {
      const messageId = this.isBuy
        ? 'trade-offers.no-data-for-asks-message'
        : 'trade-offers.no-data-for-bids-message'

      return {
        messageId: messageId,
        messageIdKeys: {
          base: this.assetPair.base,
          quote: this.assetPair.quote,
        },
      }
    },
  },
  methods: {
    selectOffer (offer) {
      this.isSubmitOfferDrawerShown = true
      this.selectedOffer = offer
    },
    closeDrawer () {
      this.isSubmitOfferDrawerShown = false
      this.$emit(EVENTS.reloadTrades)
    },
  },
}
</script>

<style lang="scss">
.trade-offers__title {
  font-size: 1.4rem;
}

.trade-offers-wrapper {
  min-height: 5.3rem;

  &--loading {
    filter: blur(1rem);
    transition: 0.3s -webkit-filter linear; // works on Safari v12.1
  }
}
</style>
