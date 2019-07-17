<template>
  <div class="customers-table">
    <template v-if="customersList.length">
      <div class="customers-table__head-actions">
        <template v-if="!isIssuanceMode">
          <button
            class="app__button-raised"
            @click="toggleIssuanceMode"
          >
            {{ 'customers-table.enable-mass-issuance-btn' | globalize }}
          </button>
        </template>

        <template v-else>
          <div class="customers-table__head-actions-group">
            <button
              class="app__button-raised"
              @click="doMassIssuance"
              :disabled="!issuanceReceivers.length"
            >
              {{ 'customers-table.do-mass-issue-btn' | globalize }}
            </button>

            <button
              class="app__button-flat app__button-flat--danger"
              @click="toggleIssuanceMode"
            >
              {{ 'customers-table.cancel-mass-issue-btn' | globalize }}
            </button>
          </div>
        </template>
      </div>
    </template>

    <!-- eslint-disable-next-line max-len -->
    <div class="app__table app__table--with-shadow app__table--last-td-to-right">
      <table class="customers-table__table">
        <thead>
          <tr>
            <th
              class="customers-table__cb-td"
              v-if="isIssuanceMode"
            >
              <tick-field
                class="customers-table__cb"
                v-model="issuanceReceivers"
                :cb-value="customersList.filter(i => i.isActive)"
              />
            </th>
            <th :title="'customers-table.email-th' | globalize">
              {{ 'customers-table.email-th' | globalize }}
            </th>
            <th :title="'customers-table.balances-th' | globalize">
              {{ 'customers-table.balances-th' | globalize }}
            </th>
            <th :title="'customers-table.status-th' | globalize">
              {{ 'customers-table.status-th' | globalize }}
            </th>
            <th class="customers-table__btn-td">
              <!-- actions -->
            </th>
          </tr>
        </thead>

        <tbody v-if="customersList.length">
          <tr
            v-for="customer in customersList"
            :key="customer.id"
          >
            <td
              class="customers-table__cb-td"
              v-if="isIssuanceMode"
            >
              <tick-field
                class="customers-table__cb"
                v-model="issuanceReceivers"
                :cb-value="customer"
                :disabled="!customer.isActive"
              />
            </td>

            <td :title="customer.email">
              {{ customer.email }}
            </td>

            <td :title="formatBalancesOf(customer)">
              <template v-if="customer.balances && customer.balances.length">
                <span>
                  {{ formatBalancesOf(customer) }}
                </span>
              </template>

              <template v-else>
                &mdash;
              </template>
            </td>

            <td :title="getCustomerStatusTranslated(customer)">
              {{ getCustomerStatusTranslated(customer) }}
            </td>

            <td class="customers-table__btn-td">
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
          v-else-if="isLoaded"
          :colspan="4"
          :message="'customers-table.no-data-msg' | globalize"
        />

        <empty-tbody-placeholder
          v-else-if="isLoadFailed"
          :colspan="4"
          :message="'customers-table.error-msg' | globalize"
        />

        <skeleton-loader-table-body
          v-else
          :cells="4"
          template="smallString"
        />
      </table>
    </div>
  </div>
</template>

<script>
import { CustomerRecord } from './customer.record'
import TickField from '@/vue/fields/TickField'
import { Bus } from '@/js/helpers/event-bus'
import EmptyTbodyPlaceholder from '@/vue/common/EmptyTbodyPlaceholder'
import SkeletonLoaderTableBody from '@/vue/common/skeleton-loader/SkeletonLoaderTableBody'

const EVENTS = {
  detailsButtonClicked: 'details-button-clicked',
}

const NUMBER_DISPLAYING_BALANCES = 3

export default {
  name: 'customers-table',

  components: {
    TickField,
    EmptyTbodyPlaceholder,
    SkeletonLoaderTableBody,
  },

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

    isLoadFailed: {
      type: Boolean,
      require: true,
    },
  },

  data () {
    return {
      isIssuanceMode: false,
      issuanceReceivers: [],
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

    toggleIssuanceMode () {
      if (this.isIssuanceMode) {
        this.isIssuanceMode = false
        this.issuanceReceivers = []
      } else {
        this.isIssuanceMode = true
      }
    },

    doMassIssuance () {
      Bus.emit('customers:massIssue', { receivers: this.issuanceReceivers })
      this.toggleIssuanceMode()
    },

    formatBalancesOf (customer) {
      let balances = customer.balances
        .filter(item => +item.amount)
      balances.sort(function (a, b) {
        return b.amount - +a.amount
      })
      const slicedBalances = balances.slice(0, NUMBER_DISPLAYING_BALANCES)
      let resolveString = slicedBalances
        .map(item => this.$options.filters
          .formatMoney({ value: item.amount, currency: item.assetCode })
        )
        .join(', ')
      if (balances.length > NUMBER_DISPLAYING_BALANCES) {
        return resolveString + '…'
      } else {
        return resolveString
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';

// TODO: move to tick field
$disabled-tick-bg: #eeeeee;
$disabled-tick-border: #e9e9e9;

.customers-table__details-btn {
  font-size: 1.2rem;
  color: $col-primary-lighten;
}

.customers-table__cb-td {
  min-width: 4.4rem;
  width: 4.4rem;
  padding-right: 0;

  & + td,
  & + th {
    padding-left: 1rem;
  }
}

.customers-table__cb {
  position: relative;
  top: 0.2rem;

  &[disabled] /deep/ .tick-field__tick,
  &[disabled] /deep/ .tick-field__input {
    cursor: not-allowed;
    background-color: $disabled-tick-bg;
    border-color: $disabled-tick-border;
  }
}

.customers-table__btn-td {
  min-width: 12rem;
  width: 12rem;
}

.customers-table__table {
  table-layout: fixed;
  min-width: 60rem;
}

.customers-table__head-actions {
  margin-bottom: 2.4rem;
  display: flex;
}

.customers-table__head-actions-group {
  display: flex;

  & > button + button {
    margin-left: 1.2rem;
  }
}
</style>
