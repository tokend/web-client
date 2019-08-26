<template>
  <div class="customer-attributes">
    <div class="app__table app__table--last-td-to-right">
      <table>
        <tbody>
          <tr>
            <td>
              {{ 'customer-attributes.email-key' | globalize }}
            </td>
            <td>
              {{ customer.email }}
            </td>
          </tr>

          <tr v-if="customer.firstName">
            <td>
              {{ 'customer-attributes.first-name-key' | globalize }}
            </td>
            <td>
              {{ customer.firstName }}
            </td>
          </tr>

          <tr v-if="customer.lastName">
            <td>
              {{ 'customer-attributes.last-name-key' | globalize }}
            </td>
            <td>
              {{ customer.lastName }}
            </td>
          </tr>

          <tr>
            <td>
              {{ 'customer-attributes.status-key' | globalize }}
            </td>
            <td>
              {{ customerStatusTranslated }}
            </td>
          </tr>

          <tr
            v-for="balance of customer.balances"
            :key="balance.id"
          >
            <td>
              {{ assetByCode(balance.assetCode).name }}
            </td>
            <td :title="balance.amount | formatMoney">
              {{ balance.amount | formatBalance }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { CustomerRecord } from '@/js/records/entities/customer.record'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

export default {
  name: 'customer-attributes',

  props: {
    customer: {
      type: CustomerRecord,
      required: true,
    },
  },

  computed: {
    ...mapGetters([
      vuexTypes.assetByCode,
    ]),
    customerStatusTranslated () {
      let translationId

      if (this.customer.isNotRegistered) {
        translationId = 'customer-attributes.not-registered-status-val'
      } else if (this.customer.isActive) {
        translationId = 'customer-attributes.active-status-val'
      } else if (this.customer.isBlocked) {
        translationId = 'customer-attributes.blocked-status-val'
      } else {
        translationId = '[UNKNOWN]'
      }

      return this.$options.filters.globalize(translationId)
    },
  },
}
</script>

<style lang="scss" scoped>
</style>
