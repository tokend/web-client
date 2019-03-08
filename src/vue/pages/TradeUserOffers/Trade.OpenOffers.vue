<template>
  <div class="trade-open-offers">
    <h2 class="app__table-title">
      {{
        'trade-open-offers.title' | globalize({
          base: assetPair.base,
          quote: assetPair.quote
        })
      }}
    </h2>
    <template v-if="openOffers.length && !isLoading">
      <div
        class="app__table
              app__table--with-shadow
              app__table--clickable-rows"
      >
        <table>
          <thead>
            <tr>
              <th>
                {{ 'trade-open-offers.table-id-lbl' | globalize }}
              </th>
              <th>
                {{ 'trade-open-offers.table-date-lbl' | globalize }}
              </th>
              <th>
                {{ 'trade-open-offers.table-offer-lbl' | globalize }}
              </th>
              <th>
                {{ 'trade-open-offers.table-base-amount-lbl' | globalize }}
              </th>
              <th>
                {{ 'trade-open-offers.table-price-lbl' | globalize }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(offer, i) in openOffers"
              :key="`trade-open-offers-row-${i}`"
              @click="selectOffer(offer)">
              <td>{{ offer.offerId }}</td>
              <td>{{ offer.createdAt | formatCalendar }}</td>
              <td>
                <template v-if="offer.isBuy">
                  {{ 'trade-open-offers.buy-lbl' | globalize }}
                </template>
                <template v-else>
                  {{ 'trade-open-offers.sell-lbl' | globalize }}
                </template>
              </td>
              <td>{{ offer.baseAmount | formatMoney }}</td>
              <td>{{ offer.price | formatMoney }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <drawer :is-shown.sync="isSubmitOfferDrawerShown">
        <template slot="heading">
          <template v-if="selectedOffer.isBuy">
            {{ 'trade-open-offers.your-buy-offer' | globalize }}
          </template>
          <template v-else>
            {{ 'trade-open-offers.your-sell-offer' | globalize }}
          </template>
        </template>
        <submit-trade-offer-form
          :asset-pair="assetPair"
          :offer="selectedOffer"
          @close-drawer="closeDrawer"
        />
      </drawer>
    </template>
    <template v-else-if="isLoading">
      <loader :message-id="'trade-open-offers.loading-msg'" />
    </template>
    <template v-else>
      <no-data-message
        icon-name="trending-up"
        title-id="trade-open-offers.no-data-title"
        message-id="trade-open-offers.no-data-message"
        :message-id-keys="{ base: assetPair.base, quote: assetPair.quote }"
      />
    </template>
  </div>
</template>

<script>
import NoDataMessage from '@/vue/common/NoDataMessage'
import SubmitTradeOfferForm from '@/vue/forms/SubmitTradeOfferForm'
import Loader from '@/vue/common/Loader'
import Drawer from '@/vue/common/Drawer'
import { globalize } from '@/vue/filters/globalize'

const EVENTS = {
  reloadOffers: 'reload-offers',
}

export default {
  name: 'trade-open-offers',
  components: {
    NoDataMessage,
    SubmitTradeOfferForm,
    Loader,
    Drawer,
  },
  props: {
    openOffers: { type: Array, required: true, default: () => [] },
    isLoading: { type: Boolean, required: true, default: false },
    assetPair: {
      type: Object,
      required: true,
      default: () => ({ base: '', quote: '' }),
    },
  },
  data: () => ({
    isSubmitOfferDrawerShown: false,
    selectedOffer: {},
  }),
  methods: {
    globalize,
    selectOffer (offer) {
      this.isSubmitOfferDrawerShown = true
      this.selectedOffer = offer
    },
    closeDrawer () {
      this.isSubmitOfferDrawerShown = false
      this.$emit(EVENTS.reloadOffers)
    },
  },
}
</script>

<style lang="scss">
</style>
