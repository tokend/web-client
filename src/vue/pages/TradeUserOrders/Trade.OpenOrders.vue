<template>
  <div class="trade-open-orders">
    <h2 class="app__table-title">
      {{
        'trade-open-orders.title' | globalize({
          base: assetPair.base,
          quote: assetPair.quote
        })
      }}
    </h2>
    <template v-if="openOrders.length">
      <div class="app__table app__table--with-shadow">
        <table>
          <thead>
            <tr>
              <th>
                {{ 'trade-open-orders.table-id-lbl' | globalize }}
              </th>
              <th>
                {{ 'trade-open-orders.table-date-lbl' | globalize }}
              </th>
              <th>
                {{ 'trade-open-orders.table-order-lbl' | globalize }}
              </th>
              <th>
                {{ 'trade-open-orders.table-base-amount-lbl' | globalize }}
              </th>
              <th>
                {{ 'trade-open-orders.table-price-lbl' | globalize }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, i) in openOrders"
              :key="`trade-open-orders-row-${i}`">
              <td>{{ item.offerId }}</td>
              <td>{{ item.createdAt | formatCalendar }}</td>
              <td>
                <template v-if="item.isBuy">
                  {{ 'trade-open-orders.buy-lbl' | globalize }}
                </template>
                <template v-else>
                  {{ 'trade-open-orders.sell-lbl' | globalize }}
                </template>
              </td>
              <td>{{ item.baseAmount | formatMoney }}</td>
              <td>{{ item.price | formatMoney }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
    <template v-else-if="isLoading">
      <loader :message-id="'trade-open-orders.loading-msg'" />
    </template>
    <template v-else>
      <no-data-message
        :title-id="'trade-open-orders.no-data-title'"
        :message-id="'trade-open-orders.no-data-message'"
        :message-id-args="{ base: assetPair.base, quote: assetPair.quote }"
      />
    </template>
  </div>
</template>

<script>
import NoDataMessage from '@/vue/common/NoDataMessage'
import Loader from '@/vue/common/Loader'

export default {
  name: 'trade-open-orders',
  components: {
    NoDataMessage,
    Loader,
  },
  props: {
    openOrders: { type: Array, required: true, default: () => [] },
    isLoading: { type: Boolean, required: true, default: false },
    assetPair: {
      type: Object,
      required: true,
      default: () => ({ base: '', quote: '' }),
    },
  },
}
</script>

<style lang="scss">
</style>
