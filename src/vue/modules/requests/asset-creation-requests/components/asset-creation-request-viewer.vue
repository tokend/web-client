<template>
  <div class="asset-creation-request-viewer">
    <asset-name-viewer
      :config="config()"
      :request="request"
    />

    <request-message-viewer
      class="asset-creation-request-viewer__state-message"
      :request="request"
    />

    <div class="app__table asset-request-details__table">
      <table>
        <tbody>
          <tr>
            <!-- eslint-disable-next-line max-len -->
            <td>{{ 'asset-request-details.max-issuance-amount-title' | globalize }}</td>
            <td>{{ request.maxIssuanceAmount | formatMoney }}</td>
          </tr>

          <tr>
            <!-- eslint-disable-next-line max-len -->
            <td>{{ 'asset-request-details.initial-preissued-amount-title' | globalize }}</td>
            <td>{{ request.initialPreissuedAmount | formatMoney }}</td>
          </tr>

          <tr>
            <td>{{ 'asset-request-details.terms-title' | globalize }}</td>
            <td>
              <a
                v-if="request.termsKey"
                class="asset-request-details__terms"
                :href="assetTermsUrl"
              >
                {{ 'asset-request-details.download-terms-btn' | globalize }}
              </a>

              <p v-else>
                {{ 'asset-request-details.no-terms-msg' | globalize }}
              </p>
            </td>
          </tr>

          <tr>
            <!-- eslint-disable-next-line max-len -->
            <td>{{ 'asset-request-details.transferable-title' | globalize }}</td>
            <td>
              <template v-if="request.isTransferable">
                {{ 'asset-request-details.present-msg' | globalize }}
              </template>

              <template v-else>
                {{ 'asset-request-details.absent-msg' | globalize }}
              </template>
            </td>
          </tr>
          <tr>
            <td>
              {{ 'asset-request-details.requires-kyc-title' | globalize }}
            </td>
            <td>
              <template v-if="request.assetType === kycRequiredAssetType">
                {{ 'asset-request-details.present-msg' | globalize }}
              </template>

              <template v-else>
                {{ 'asset-request-details.absent-msg' | globalize }}
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="asset-request-details__buttons">
      <button
        v-ripple
        v-if="!formMixin.isConfirmationShown"
        class="asset-request-details__update-btn"
        :disabled="isRequestCancelling || !canBeUpdated"
        @click="$emit(EVENTS.updateAsk)"
      >
        {{ 'asset-request-details.update-btn' | globalize }}
      </button>

      <button
        v-ripple
        v-if="!formMixin.isConfirmationShown"
        class="asset-request-details__cancel-btn"
        :disabled="isRequestCancelling || !canBeCanceled"
        @click="showConfirmation"
      >
        {{ 'asset-request-details.cancel-btn' | globalize }}
      </button>

      <form-confirmation
        v-if="formMixin.isConfirmationShown"
        message-id="asset-request-details.sure-want-cancel"
        ok-button-text-id="asset-request-details.present-msg"
        cancel-button-text-id="asset-request-details.absent-msg"
        @ok="cancelRequest"
        @cancel="hideConfirmation"
      />
    </div>
  </div>
</template>

<script>
import AssetNameViewer from '../../shared/components/asset-name-viewer'
import RequestMessageViewer from '../../shared/components/request-message-viewer'

import FormMixin from '@/vue/mixins/form.mixin'

import { ASSET_POLICIES } from '@tokend/js-sdk'

import { AssetCreationRequest } from '../wrappers/asset-creation-request'

import { config } from '../_config'

import { mapActions } from 'vuex'
import { types } from '../store/types'

import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'

const EVENTS = {
  updateAsk: 'update-ask',
  cancel: 'cancel',
}

export default {
  name: 'asset-creation-request-viewer',
  components: {
    AssetNameViewer,
    RequestMessageViewer,
  },
  mixins: [FormMixin],

  props: {
    request: { type: AssetCreationRequest, required: true },
    kycRequiredAssetType: { type: Number, required: true },
  },

  data: _ => ({
    isRequestCancelling: false,
    config,
    ASSET_POLICIES,
    EVENTS,
  }),

  computed: {
    assetTermsUrl () {
      return this.request.termsUrl(config.FILE_STORAGE)
    },

    canBeUpdated () {
      return this.request.isRejected || this.request.isPending
    },

    canBeCanceled () {
      return this.request.isPending
    },
  },

  methods: {
    ...mapActions('asset-creation-requests', {
      cancelAssetCreationRequest: types.CANCEL_ASSET_CREATION_REQUEST,
    }),

    async cancelRequest () {
      this.hideConfirmation()
      this.isRequestCancelling = true
      try {
        await this.cancelAssetCreationRequest(this.request.id)
        Bus.success('asset-creation-requests.request-canceled-msg')
        this.$emit(EVENTS.cancel)
      } catch (e) {
        this.isRequestCancelling = false
        ErrorHandler.process(e)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import "~@scss/variables";
@import "~@scss/mixins";

.asset-creation-request-viewer__state-message {
  margin-top: 2rem;
}

.asset-request-details__table {
  margin-top: 2rem;

  tr td:last-child {
    text-align: right;
  }
}

.asset-request-details__terms {
  font-size: 1.4rem;
  color: $col-primary-lighten;
  text-decoration: none;

  &:visited {
    color: $col-primary-lighten;
  }
}

.asset-request-details__buttons {
  margin-top: 4.9rem;
  display: flex;

  button + button {
    margin-left: auto;
  }
}

.asset-request-details__update-btn {
  @include button-raised();

  margin-bottom: 2rem;
  width: 18rem;
}

.asset-request-details__cancel-btn {
  @include button-flat();

  margin-bottom: 2rem;
  font-weight: normal;
}
</style>
