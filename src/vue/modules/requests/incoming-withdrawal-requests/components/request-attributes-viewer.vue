<template>
  <div class="request-attributes-viewer app__table">
    <table>
      <tbody>
        <tr>
          <td>{{ 'incoming-withdrawal-requests.request-id' | globalize }}</td>
          <td>{{ request.id }}</td>
        </tr>

        <tr>
          <td>{{ 'incoming-withdrawal-requests.created' | globalize }}</td>
          <td>{{ request.createdAt | formatCalendar }}</td>
        </tr>

        <tr>
          <td>
            {{ 'incoming-withdrawal-requests.requestor-email' | globalize }}
          </td>
          <td>
            <email-getter :account-id="request.requestor" />
          </td>
        </tr>

        <tr>
          <td>{{ 'incoming-withdrawal-requests.requestor-id' | globalize }}</td>
          <td>{{ request.requestor }}</td>
        </tr>

        <tr>
          <td>{{ 'incoming-withdrawal-requests.comment' | globalize }}</td>
          <td>{{ request.comment }}</td>
        </tr>

        <tr>
          <td>{{ 'incoming-withdrawal-requests.amount' | globalize }}</td>
          <td>{{ formatMoney(request.amount) }}  </td>
        </tr>

        <tr>
          <td>{{ 'incoming-withdrawal-requests.fixed-fee' | globalize }}</td>
          <td>{{ formatMoney(request.fixedFee) }}</td>
        </tr>

        <tr>
          <td>
            <!-- eslint-disable-next-line max-len -->
            {{ 'incoming-withdrawal-requests.calculated-percent-fee' | globalize }}
          </td>
          <td>{{ formatMoney(request.calculatedPercentFee) }}</td>
        </tr>

        <tr>
          <td>{{ 'incoming-withdrawal-requests.total-fee' | globalize }}</td>
          <td>{{ formatMoney(request.totalFee) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import EmailGetter from '@/vue/common/EmailGetter'

import { IncomingWithdrawalRequest } from '../wrappers/incoming-withdrawal-request'
import { formatMoney } from '@/js/helpers/money-helper'

export default {
  name: 'request-attributes-viewer',
  components: {
    EmailGetter,
  },
  props: {
    request: { type: IncomingWithdrawalRequest, required: true },
  },
  setup () {
    return {
      formatMoney,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';

.request-attributes-viewer tr td:last-child {
  text-align: right;
}

.request-attributes-viewer__terms {
  font-size: 1.4rem;
  color: $col-primary-lighten;
  text-decoration: none;

  &:visited {
    color: $col-primary-lighten;
  }
}
</style>
