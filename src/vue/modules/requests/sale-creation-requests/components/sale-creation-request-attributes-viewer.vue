<template>
  <div class="sale-creation-request-attributes-viewer">
    <p class="sale-creation-request-attributes-viewer__short-description">
      {{ request.shortDescription }}
    </p>

    <div class="sale-creation-request-attributes-viewer__table app__table">
      <table>
        <tbody>
          <tr>
            <td>{{ 'sale-creation-requests.name-title' | globalize }}</td>
            <td>{{ request.name }}</td>
          </tr>
          <tr>
            <td>
              {{ 'sale-creation-requests.start-time-title' | globalize }}
            </td>
            <td>{{ request.startTime | formatCalendar }}</td>
          </tr>
          <tr>
            <td>
              {{ 'sale-creation-requests.close-time-title' | globalize }}
            </td>
            <td>
              {{ request.endTime | formatCalendar }}
            </td>
          </tr>
          <tr>
            <td>{{ 'sale-creation-requests.soft-cap-title' | globalize }}</td>
            <td>
              <!-- eslint-disable-next-line max-len -->
              {{ { value: request.softCap, currency: request.defaultQuoteAsset } | formatMoney }}
            </td>
          </tr>
          <tr>
            <td>{{ 'sale-creation-requests.hard-cap-title' | globalize }}</td>
            <td>
              <!-- eslint-disable-next-line max-len -->
              {{ { value: request.hardCap, currency: request.defaultQuoteAsset } | formatMoney }}
            </td>
          </tr>
          <tr>
            <td>
              <!-- eslint-disable-next-line max-len -->
              {{ 'sale-creation-requests.sell-title' | globalize({ asset: request.baseAsset }) }}
            </td>
            <td>
              <!-- eslint-disable-next-line max-len -->
              {{ { value: request.baseAssetForHardCap, currency: request.baseAsset } | formatMoney }}
            </td>
          </tr>
          <tr>
            <td>
              {{ 'sale-creation-requests.video-about-sale-title' | globalize }}
            </td>
            <td>
              <a
                v-if="request.youtubeVideoUrl"
                class="sale-creation-request-attributes-viewer__video-btn"
                :href="request.youtubeVideoUrl"
                target="_blank"
              >
                {{ 'sale-creation-requests.view-video-btn' | globalize }}
              </a>
              <p v-else>
                {{ 'sale-creation-requests.no-video-msg' | globalize }}
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { SaleCreationRequest } from '../wrappers/sale-creation-request'

export default {
  name: 'sale-creation-request-attributes-viewer',
  props: {
    request: { type: SaleCreationRequest, required: true },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';

.sale-creation-request-attributes-viewer__short-description {
  margin-top: 4rem;
  font-size: 1.4rem;
  color: $col-text;
}

.sale-creation-request-attributes-viewer__table {
  margin-top: 2rem;

  tr td:last-child {
    text-align: right;
  }
}

.sale-creation-request-attributes-viewer__video-btn {
  color: $col-link;
  text-decoration: none;

  &:visited {
    color: $col-link;
  }
}
</style>
