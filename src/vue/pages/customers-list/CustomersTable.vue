<template>
  <div class="customers-table">
    <div
      class="app__table app__table--with-shadow
        app__table--last-td-to-right
      ">
      <table>
        <thead>
          <tr>
            <th :title="'customers-table.email-th' | globalize">
              {{ 'customers-table.email-th' | globalize }}
            </th>
            <th :title="'customers-table.balances-th' | globalize">
              {{ 'customers-table.balances-th' | globalize }}
            </th>
            <th :title="'customers-table.status-th' | globalize">
              {{ 'customers-table.status-th' | globalize }}
            </th>
            <th>
              <!-- actions -->
            </th>
          </tr>
        </thead>

        <tbody v-if="customersList.length">
          <tr
            v-for="customer in customersList"
            :key="customer.id"
          >
            <td :title="customer.email">
              {{ customer.email }}
            </td>

            <td :title="customer.balances">
              {{ customer.balances }}
            </td>

            <td :title="getCustomerStatusTranslated(customer)">
              {{ getCustomerStatusTranslated(customer) }}
            </td>

            <td>
              <button
                class="customers-table__details-btn"
                @click="$emit(EVENTS.detailsButtonClicked, customer)"
              >
                {{ 'customers-table.details-btn' | globalize }}
              </button>
            </td>
          </tr>
        </tbody>

        <empty-tbody-placeholder
          v-else-if="isLoaded && !customersList.length"
          :colspan="3"
          :message="'customers-table.no-data-msg' | globalize"
        />

        <empty-tbody-placeholder
          v-else-if="isLoadFailed"
          :colspan="3"
          :message="'customers-table.error-msg' | globalize"
        />

        <skeleton-loader-table-body
          v-else
          :cells="3"
          template="smallString"
        />
      </table>
    </div>
  </div>
</template>

<script>
import { CustomerRecord } from './customer.record'

const EVENTS = {
  detailsButtonClicked: 'details-button-clicked',
}

export default {

  props: {
    customersList: {
      type: Array,
      required: true,
      validator (value) {
        return value.every(item => item instanceof CustomerRecord)
      },
    },

    isLoaded: {
      type: Boolean,
      require: true,
    },
  },
  data () {
    return {
      EVENTS,
    }
  },

  methods: {
    getCustomerStatusTranslated (customer) {
      let translationId

      if (customer.isNotRegistered) {
        translationId = 'customers-table.not-registered-status-td'
      } else if (customer.isActive) {
        translationId = 'customers-table.active-status-td'
      } else if (customer.isBlocked) {
        translationId = 'customers-table.blocked-status-td'
      } else {
        translationId = '[UNKNOWN]'
      }

      return this.$options.filters.globalize(translationId)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';

.customers-table__details-btn {
  font-size: 1.2rem;
  color: $col-primary-lighten;
}
</style>
