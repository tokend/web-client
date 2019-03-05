<template>
  <div class="issuances-table">
    <template v-if="issuances.length">
      <div class="app__table app__table--with-shadow">
        <table>
          <thead>
            <tr>
              <!-- eslint-disable-next-line max-len -->
              <th :title="'issuance-explorer.table.counterparty-th' | globalize">
                {{ 'issuance-explorer.table.counterparty-th' | globalize }}
              </th>
              <th :title="'issuance-explorer.table.amount-th' | globalize">
                {{ 'issuance-explorer.table.amount-th' | globalize }}
              </th>
              <th :title="'issuance-explorer.table.asset-code-th' | globalize">
                {{ 'issuance-explorer.table.asset-code-th' | globalize }}
              </th>
              <th :title="'issuance-explorer.table.date-th' | globalize">
                {{ 'issuance-explorer.table.date-th' | globalize }}
              </th>
              <th :title="'issuance-explorer.table.reference-th' | globalize">
                {{ 'issuance-explorer.table.reference-th' | globalize }}
              </th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="issuance in issuances" :key="issuance.id">
              <td>
                <email-getter :balance-id="issuance.counterparty" />
              </td>

              <td :title="issuance.amount | formatMoney">
                {{ issuance.amount | formatMoney }}
              </td>

              <td :title="issuance.asset">
                {{ issuance.asset }}
              </td>

              <td :title="issuance.date | formatCalendar">
                {{ issuance.date | formatCalendar }}
              </td>

              <td :title="issuance.reference">
                {{ issuance.reference }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <template v-else>
      <no-data-message
        icon-name="trending-up"
        title-id="issuance-explorer.table.no-issuances-title"
        message-id="issuance-explorer.table.no-issuances-msg"
      />
    </template>
  </div>
</template>

<script>
import EmailGetter from '@/vue/common/EmailGetter'
import NoDataMessage from '@/vue/common/NoDataMessage'

export default {
  name: 'issuanes-table',
  components: {
    EmailGetter,
    NoDataMessage,
  },

  props: {
    issuances: {
      type: Array, /** {@link Issuance} **/
      required: true,
    },
  },
}
</script>
