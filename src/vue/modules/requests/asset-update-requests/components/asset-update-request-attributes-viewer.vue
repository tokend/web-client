<template>
  <div class="asset-update-request-attributes-viewer app__table">
    <table>
      <tbody>
        <tr>
          <td>{{ 'asset-update-requests.terms-title' | globalize }}</td>
          <td>
            <a
              v-if="request.termsKey"
              class="asset-update-request-attributes-viewer__terms"
              :href="assetTermsUrl"
            >
              {{ 'asset-update-requests.download-terms-btn' | globalize }}
            </a>

            <p v-else>
              {{ 'asset-update-requests.no-terms-msg' | globalize }}
            </p>
          </td>
        </tr>

        <tr>
          <!-- eslint-disable-next-line max-len -->
          <td>{{ 'asset-update-requests.transferable-title' | globalize }}</td>
          <td>
            <template v-if="request.isTransferable">
              {{ 'asset-update-requests.yes-msg' | globalize }}
            </template>

            <template v-else>
              {{ 'asset-update-requests.no-msg' | globalize }}
            </template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { AssetUpdateRequest } from '../wrappers/asset-update-request'

import { config } from '../_config'

export default {
  name: 'asset-update-request-attributes-viewer',
  props: {
    request: { type: AssetUpdateRequest, required: true },
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

.asset-update-request-attributes-viewer {
  tr td:last-child {
    text-align: right;
  }
}

.asset-update-request-attributes-viewer__terms {
  font-size: 1.4rem;
  color: $col-primary-lighten;
  text-decoration: none;

  &:visited {
    color: $col-primary-lighten;
  }
}
</style>
