<template>
  <div class="issuances-table">
    <template v-if="issuances.length">
      <div class="app__table app__table--with-shadow">
        <table>
          <thead>
            <tr>
              <th :title="'issuance.counterparty-lbl' | globalize">
                {{ 'issuance.counterparty-lbl' | globalize }}
              </th>
              <th :title="'issuance.amount-lbl' | globalize">
                {{ 'issuance.amount-lbl' | globalize }}
              </th>
              <th :title="'issuance.asset-code-lbl' | globalize">
                {{ 'issuance.asset-code-lbl' | globalize }}
              </th>
              <th :title="'issuance.date-lbl' | globalize">
                {{ 'issuance.date-lbl' | globalize }}
              </th>
              <th :title="'issuance.reference-lbl' | globalize">
                {{ 'issuance.reference-lbl' | globalize }}
              </th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="issuance in issuances" :key="issuance.id">
              <td>
                <email-getter :account-id="issuance.counterparty" />
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
        title-id="issuance.no-issuance-history-title"
        message-id="issuance.no-issuance-history-msg"
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
