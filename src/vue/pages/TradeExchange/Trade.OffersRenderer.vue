<template>
  <div class="trade-offers">
    <h3 class="app__table-title">
      <template v-if="isBuy">
        {{ 'trade-offers.subtitle-ask' | globalize }}
      </template>
      <template v-else>
        {{ 'trade-offers.subtitle-bid' | globalize }}
      </template>
    </h3>
    <template v-if="offersList.length">
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
          <tbody>
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
        </table>
      </div>
    </template>
    <template v-else-if="isLoading">
      <loader :message-id="'trade-offers.loading-msg'" />
    </template>
    <template v-else>
      <no-data-message
        :title-id="'trade-offers.no-data-title'"
        :message-id="noDataMessage.messageId"
        :message-id-args="noDataMessage.messageIdArgs"
      />
    </template>

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
        :is-buy="isBuy"
        :asset-pair="assetPair"
        :offer="selectedOffer"
        @close-drawer="closeDrawer"
      />
    </drawer>
  </div>
</template>

<script>
import SubmitTradeOfferForm from '@/vue/forms/SubmitTradeOfferForm'
import NoDataMessage from '@/vue/common/NoDataMessage'
import Loader from '@/vue/common/Loader'
import FormMixin from '@/vue/mixins/form.mixin'
import Drawer from '@/vue/common/Drawer'
import { vuexTypes } from '@/vuex'
import { mapGetters } from 'vuex'

const EVENTS = {
  reloadTrades: 'reload-trades',
}

export default {
  name: 'trade-offers-renderer',
  components: {
    NoDataMessage,
    Loader,
    Drawer,
    SubmitTradeOfferForm,
  },
  mixins: [FormMixin],
  props: {
    assetPair: {
      type: Object,
      required: true,
      default: () => ({ base: '', quote: '' }),
    },
    isLoading: { type: Boolean, required: true },
    isBuy: { type: Boolean, required: true },
    offersList: { type: Array, required: true },
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
        messageIdArgs: {
          base: this.assetPair.base,
          quote: this.assetPair.quote,
        },
      }
    },
  },
  methods: {
    selectOffer (offer) {
      if (offer.ownerId !== this.accountId) {
        this.isSubmitOfferDrawerShown = true
        this.selectedOffer = offer
      }
    },
    closeDrawer () {
      this.isSubmitOfferDrawerShown = false
      this.$emit(EVENTS.reloadTrades)
    },
  },
}
</script>

<style lang="scss">

</style>
