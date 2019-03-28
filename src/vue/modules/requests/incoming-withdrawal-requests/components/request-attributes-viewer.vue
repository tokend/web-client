<template>
  <div class="request-attributes-viewer app__table">
    <table>
      <tbody>
        <tr>
          <td>
            {{ 'withdrawal-request-details.request-id' | globalize }}
          </td>
          <td>
            {{ request.id }}
          </td>
        </tr>

        <tr>
          <td>
            {{ 'withdrawal-request-details.requestor-email' | globalize }}
          </td>
          <td>
            <email-getter :account-id="request.requestor" />
          </td>
        </tr>

        <tr>
          <td>
            {{ 'withdrawal-request-details.requestor-id' | globalize }}
          </td>
          <td>
            {{ request.requestor }}
          </td>
        </tr>

        <tr>
          <td>
            {{ 'withdrawal-request-details.address' | globalize }}
          </td>
          <td>
            {{ request.address }}
          </td>
        </tr>

        <tr>
          <td>
            {{ 'withdrawal-request-details.amount' | globalize }}
          </td>
          <td>
            {{ request.amount | formatMoney }}
            {{ request.asset }}
          </td>
        </tr>

        <tr>
          <td>
            {{ 'withdrawal-request-details.fixed-fee' | globalize }}
          </td>
          <td>
            {{ request.fixedFee | formatMoney }}
            {{ request.asset }}
          </td>
        </tr>

        <tr>
          <td>
            {{ 'withdrawal-request-details.percent-fee' | globalize }}
          </td>
          <td>
            {{ request.percentFee | formatMoney }}
            {{ request.asset }}
          </td>
        </tr>

        <tr>
          <td>
            {{ 'withdrawal-request-details.total-fee' | globalize }}
          </td>
          <td>
            {{ (+request.percentFee + +request.fixedFee) | formatMoney }}
            {{ request.asset }}
          </td>
        </tr>

        <tr>
          <td>
            {{ 'withdrawal-request-details.created' | globalize }}
          </td>
          <td>
            {{ request.createdAt | formatCalendar }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import EmailGetter from '@/vue/common/EmailGetter'

import { IncomingWithdrawalRequest } from '../wrappers/incoming-withdrawal-request'

import { config } from '../_config'

export default {
  name: 'request-attributes-viewer',
  components: {
    EmailGetter,
  },
  props: {
    request: { type: IncomingWithdrawalRequest, required: true },
  },

  computed: {
    assetTermsUrl () {
      return this.request.termsUrl(config().storageURL)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';

.request-attributes-viewer {
  tr td:last-child {
    text-align: right;
  }
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
