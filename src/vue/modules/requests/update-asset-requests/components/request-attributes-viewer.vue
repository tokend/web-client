<template>
  <div class="request-attributes-viewer app__table">
    <table>
      <tbody>
        <tr>
          <td>{{ 'update-asset-requests.terms-title' | globalize }}</td>
          <td>
            <a
              v-if="request.termsKey"
              class="request-attributes-viewer__terms"
              :href="assetTermsUrl"
            >
              {{ 'update-asset-requests.download-terms-btn' | globalize }}
            </a>

            <p v-else>
              {{ 'update-asset-requests.no-terms-msg' | globalize }}
            </p>
          </td>
        </tr>

        <tr>
          <td>{{ 'update-asset-requests.transferable-title' | globalize }}</td>
          <td>
            <template v-if="request.isTransferable">
              {{ 'update-asset-requests.yes-msg' | globalize }}
            </template>

            <template v-else>
              {{ 'update-asset-requests.no-msg' | globalize }}
            </template>
          </td>
        </tr>

        <tr>
          <td>{{ 'create-asset-requests.withdrawable-title' | globalize }}</td>
          <td>
            <template v-if="request.isWithdrawable">
              {{ 'create-asset-requests.yes-msg' | globalize }}
            </template>

            <template v-else>
              {{ 'create-asset-requests.no-msg' | globalize }}
            </template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { UpdateAssetRequest } from '../wrappers/update-asset-request'

import config from '@/config'

export default {
  name: 'request-attributes-viewer',
  props: {
    request: { type: UpdateAssetRequest, required: true },
  },

  computed: {
    assetTermsUrl () {
      return this.request.termsUrl(config.FILE_STORAGE)
    },
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
