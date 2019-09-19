<template>
  <div class="request-attributes-viewer app__table">
    <table>
      <tbody>
        <tr>
          <td>{{ 'sponsorship-requests.request-id' | globalize }}</td>
          <td>{{ request.id }}</td>
        </tr>

        <tr>
          <!-- eslint-disable max-len -->
          <template v-if="isIncomingRequests">
            <td>{{ 'sponsorship-requests.sponsor-business-key' | globalize }}</td>
            <td :title="request.sponsorBusiness">
              <email-getter :account-id="request.sponsorBusiness" />
            </td>
          </template>
          <template v-else>
            <td>{{ 'sponsorship-requests.consumer-business-key' | globalize }}</td>
            <td :title="request.consumerBusiness">
              <email-getter :account-id="request.consumerBusiness" />
            </td>
          </template>
        </tr>

        <tr>
          <td>{{ 'sponsorship-requests.sponsor-asset-name-key' | globalize }}</td>
          <td>{{ request.consumerAsset.name }}</td>
        </tr>

        <tr>
          <td>
            {{ 'sponsorship-requests.amount-key' | globalize }}
          </td>
          <td>
            {{ request.amount | formatMoney }}
            {{ request.sponsorAsset.name }}
          </td>
        </tr>
        <!-- eslint-enable max-len -->
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
    isIncomingRequests: { type: Boolean, default: false },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';

.request-attributes-viewer tr td:last-child {
  text-align: right;
}
</style>
