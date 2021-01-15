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
          <tbody
            v-if="openOffers.length && !isLoading"
          >
            <tr
              v-for="(offer, i) in openOffers"
              :key="`trade-open-offers-row-${i}`"
              @click="selectOffer(offer)">
              <td>{{ offer.id }}</td>
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
          <empty-tbody-placeholder
            v-else
            :colspan="5"
            :message="'trade-open-offers.no-data-message' | globalize({
              base: assetPair.base,
              quote: assetPair.quote
            })"
          />
        </table>
      </div>
      <drawer :is-shown.sync="isSubmitOfferDrawerShown">
        <template slot="heading">
          <template v-if="selectedOffer.isBuy">
            {{ 'trade-open-offers.your-buy-order' | globalize }}
          </template>
          <template v-else>
            {{ 'trade-open-offers.your-sell-order' | globalize }}
          </template>
        </template>
        <your-trade-offer-form
          :offer="selectedOffer"
          :former="former"
          @offer-canceled="closeDrawer"
          @offer-updated="closeDrawer"
        />
      </drawer>
    </template>
    <template v-if="isLoading">
      <loader :message-id="'trade-open-offers.loading-msg'" />
    </template>
  </div>
</template>

<script>
import YourTradeOfferForm from '@/vue/forms/TradeForms/YourTradeOfferForm'
import Loader from '@/vue/common/Loader'
import Drawer from '@/vue/common/Drawer'
import { globalize } from '@/vue/filters/globalize'
import EmptyTbodyPlaceholder from '@/vue/common/EmptyTbodyPlaceholder'
import { TradeFormer } from '@/js/formers/TradeFormer'

const EVENTS = {
  reloadOffers: 'reload-offers',
}

export default {
  name: 'trade-open-offers',
  components: {
    YourTradeOfferForm,
    Loader,
    Drawer,
    EmptyTbodyPlaceholder,
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
    former: null,
  }),
  methods: {
    globalize,
    selectOffer (offer) {
      this.isSubmitOfferDrawerShown = true
      this.selectedOffer = offer
      this.former = new TradeFormer(offer)
      this.former.setAttr('baseBalanceId', offer.baseBalance.id)
      this.former.setAttr('quoteBalanceId', offer.quoteBalance.id)
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
