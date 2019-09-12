<template>
  <div class="request-attributes-viewer app__table">
    <table>
      <tbody>
        <tr>
          <td>{{ 'sponsorship-requests.request-id' | globalize }}</td>
          <td>{{ request.id }}</td>
        </tr>

        <tr>
          <td>{{ 'sponsorship-requests.created' | globalize }}</td>
          <td>{{ request.createdAt | formatCalendar }}</td>
        </tr>

        <tr>
          <td>
            {{ 'sponsorship-requests.requestor-email' | globalize }}
          </td>
          <td>
            <email-getter :account-id="request.requestor" />
          </td>
        </tr>

        <tr>
          <td>{{ 'sponsorship-requests.requestor-id' | globalize }}</td>
          <td>{{ request.requestor }}</td>
        </tr>

        <tr>
          <td>{{ 'sponsorship-requests.comment' | globalize }}</td>
          <td>{{ request.comment }}</td>
        </tr>

        <tr>
          <td>{{ 'sponsorship-requests.amount' | globalize }}</td>
          <td>{{ request.amount | formatMoney }}  </td>
        </tr>

        <tr>
          <td>{{ 'sponsorship-requests.fixed-fee' | globalize }}</td>
          <td>{{ request.fixedFee | formatMoney }}</td>
        </tr>

        <tr>
          <td>
            <!-- eslint-disable-next-line max-len -->
            {{ 'sponsorship-requests.calculated-percent-fee' | globalize }}
          </td>
          <td>{{ request.calculatedPercentFee | formatMoney }}</td>
        </tr>

        <tr>
          <td>{{ 'sponsorship-requests.total-fee' | globalize }}</td>
          <td>{{ request.totalFee | formatMoney }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import EmailGetter from '@/vue/common/EmailGetter'

import { SponsorshipRequest } from '../wrappers/sponsorship-request'

export default {
  name: 'request-attributes-viewer',
  components: {
    EmailGetter,
  },
  props: {
    request: { type: SponsorshipRequest, required: true },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';

.request-attributes-viewer tr td:last-child {
  text-align: right;
}
</style>
