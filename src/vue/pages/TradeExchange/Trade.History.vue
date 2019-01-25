<template>
  <div class="trade-history">
    <h2 class="app__table-title">
      {{ 'trade-history.title' | globalize }}
    </h2>
    <template v-if="tradeHistory.length">
      <div class="app__table app__table--with-shadow">
        <table>
          <thead>
            <tr>
              <th>
                <!-- eslint-disable-next-line -->
                {{ 'trade-history.table-amount-lbl' | globalize({ asset: assets.base }) }}
              </th>
              <th>
                <!-- eslint-disable-next-line -->
                {{ 'trade-history.table-price-lbl' | globalize({ asset: assets.quote }) }}
              </th>
              <th>
                <!-- eslint-disable-next-line -->
                {{ 'trade-history.table-total-lbl' | globalize({ asset: assets.quote }) }}
              </th>
              <th>
                {{ 'trade-history.table-time-lbl' | globalize }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, i) in tradeHistory"
              :key="`trade-history-row-${i}`">
              <td>{{ item.baseAmount }}</td>
              <td>{{ item.price }}</td>
              <td>{{ item.quoteAmount }}</td>
              <td>{{ item.createdAt | formatDate }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
    <template v-else-if="isLoading">
      <loader :message-id="'trade-history.loading-msg'" />
    </template>
    <template v-else>
      <no-data-message
        :title-id="'trade-history.no-data-title'"
        :message-id="'trade-history.no-data-message'"
        :message-id-args="{ base: assets.base, quote: assets.quote }"
      />
    </template>
  </div>
</template>

<script>
import NoDataMessage from '@/vue/common/NoDataMessage'
import Loader from '@/vue/common/Loader'

export default {
  name: 'trade-history',
  components: {
    NoDataMessage,
    Loader,
  },
  props: {
    assets: {
      type: Object,
      required: true,
      default: () => ({ base: '', quote: '' }),
    },
    tradeHistory: { type: Array, required: true, default: () => [] },
    isLoading: { type: Boolean, required: true, default: false },
  },
}
</script>

<style lang="scss">
</style>
