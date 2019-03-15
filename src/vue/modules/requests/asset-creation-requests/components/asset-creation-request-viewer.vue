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
          <template v-if="request.assetType">
            <tr>
              <!-- eslint-disable-next-line max-len -->
              <td>{{ 'asset-request-details.requires-kyc-title' | globalize }}</td>
              <td>
                <template v-if="request.assetType === kvAssetTypeKycRequired">
                  {{ 'asset-request-details.present-msg' | globalize }}
                </template>

                <template v-else>
                  {{ 'asset-request-details.absent-msg' | globalize }}
                </template>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <div class="asset-request-details__buttons">
      <button
        v-ripple
        class="asset-request-details__update-btn"
        :disabled="isPending || !canBeUpdated"
        @click="$emit(EVENTS.update)"
      >
        {{ 'asset-request-details.update-btn' | globalize }}
      </button>

      <button
        v-ripple
        class="asset-request-details__cancel-btn"
        :disabled="isPending || !canBeCanceled"
        @click="$emit(EVENTS.cancel)"
      >
        {{ 'asset-request-details.cancel-btn' | globalize }}
      </button>
    </div>
  </div>
</template>

<script>
import AssetNameViewer from '../../shared/components/asset-name-viewer'
import RequestMessageViewer from '../../shared/components/request-message-viewer'

import { ASSET_POLICIES } from '@tokend/js-sdk'

import { AssetCreationRequest } from '../wrappers/asset-creation-request'

import { config } from '../_config'

import { mapGetters, mapActions } from 'vuex'
import { vuexTypes } from '@/vuex'

const EVENTS = {
  update: 'update',
  cancel: 'cancel',
}

export default {
  name: 'asset-creation-request-viewer',
  components: {
    AssetNameViewer,
    RequestMessageViewer,
  },

  props: {
    request: {
      type: AssetCreationRequest,
      required: true,
    },
    isPending: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  data: _ => ({
    config,
    ASSET_POLICIES,
    EVENTS,
  }),

  computed: {
    ...mapGetters({
      kvAssetTypeKycRequired: vuexTypes.kvAssetTypeKycRequired,
    }),

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
    ...mapActions({
      loadKvAssetTypeKycRequired: vuexTypes.LOAD_KV_KYC_REQUIRED,
    }),
    // async cancelRequest () {
    //   this.isRequestCancelling = true
    //   try {
    //     const operation = base.ManageAssetBuilder.cancelAssetRequest({
    //       requestID: this.selectedRequest.id,
    //     })
    //     await api.postOperations(operation)
    //     // const { data } =
    // await Sdk.horizon.request.get(this.selectedRequest.id)
    //     // this.requestsHistory.splice(this.selectedIndex, 1,
    //     //   RecordWrapper.request(data)
    //     // )
    //     Bus.success('asset-creation-requests.request-canceled-msg')
    //   } catch (e) {
    //     ErrorHandler.process(e)
    //   }
    //   this.isRequestCancelling = false
    // },
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
