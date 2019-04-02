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
              <!-- eslint-disable-next-line max-len -->
              <th :title="'issuance-explorer.table.state-header-th' | globalize">
                {{ 'issuance-explorer.table.state-header-th' | globalize }}
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

              <td
                v-if="issuance.isApproved"
                class="request-state request-state--approved"
                :title="'request-states.approved-state' | globalize"
              >
                {{ 'request-states.approved-state' | globalize }}
              </td>

              <td
                v-if="issuance.isPending"
                class="request-state request-state--pending"
                :title="'request-states.pending-state' | globalize"
              >
                {{ 'request-states.pending-state' | globalize }}
              </td>

              <td
                v-if="issuance.isRejected"
                class="request-state request-state--rejected"
                :title="'request-states.rejected-state' | globalize"
              >
                {{ 'request-states.rejected-state' | globalize }}
              </td>

              <td
                v-if="issuance.isCanceled"
                class="request-state request-state--canceled"
                :title="'request-states.canceled-state' | globalize"
              >
                {{ 'request-states.canceled-state' | globalize }}
              </td>

              <td
                v-if="issuance.isPermanentlyRejected"
                class="request-state request-state--permanently-rejected"
                :title="'request-states.permanently-rejected-state' | globalize"
              >
                {{ 'request-states.permanently-rejected-state' | globalize }}
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
        :title="'issuance-explorer.table.no-issuances-title' | globalize"
        :message="'issuance-explorer.table.no-issuances-msg' | globalize"
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

<style lang="scss">
  @import "~@scss/variables";
  .app__table {
    .request-state {
      padding-left: 3rem;
      position: relative;

      &:before {
        content: "";
        position: absolute;
        width: 0.6rem;
        height: 0.6rem;
        top: 1.7rem;
        transform: translateY(-50%);
        left: 1.6rem;
        border-radius: 100%;
      }

      &--approved:before {
        background-color: $col-success;
      }

      &--pending:before {
        background-color: $col-warning;
      }

      &--rejected:before,
      &--canceled:before,
      &--permanently-rejected:before {
        background-color: $col-error;
      }
    }
  }
</style>
