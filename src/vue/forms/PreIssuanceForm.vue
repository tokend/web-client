<template>
  <div
    v-if="isLoaded && ownedAssets.length"
    class="pre-issuance-form"
  >
    <form
      class="app__form pre-issuance-form"
      @submit.prevent="isFormValid() && showConfirmation()"
    >
      <div class="app__form-row">
        <div class="app__form-field">
          <file-field
            :label="'issuance.pre-issuance-lbl' | globalize"
            :note="'issuance.file-type-note' | globalize"
            accept=".iss"
            v-model="preIssuanceDocument"
            :disabled="formMixin.isDisabled"
            :error-message="getFieldErrorMessage('preIssuanceDocument')"
          />
        </div>
      </div>
      <div
        v-if="issuance"
        class="pre-issuance-form__issuance-details"
      >
        <h3>{{ 'issuance.pre-issuance-details-title' | globalize }}</h3>
        <div class="app__table">
          <table>
            <thead>
              <th>{{ 'issuance.asset-lbl' | globalize }}</th>
              <th>{{ 'issuance.amount-lbl' | globalize }}</th>
            </thead>
            <tbody>
              <tr>
                <td>{{ issuance.asset }}</td>
                <td>{{ issuance.amount | formatMoney }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="app__form-actions">
        <form-confirmation
          v-if="formMixin.isConfirmationShown"
          @ok="hideConfirmation() || submit()"
          @cancel="hideConfirmation"
        />
        <button
          v-else
          v-ripple
          type="submit"
          class="pre-issuance-form__submit-btn"
          :disabled="formMixin.isDisabled"
        >
          {{ 'issuance.upload-btn' | globalize }}
        </button>
      </div>
    </form>
  </div>
  <div v-else-if="isLoaded && !ownedAssets.length">
    <p>
      {{ 'issuance.no-owned-assets-msg' | globalize }}
    </p>
  </div>
  <div v-else>
    <loader :message-id="'issuance.loading-msg'" />
  </div>
</template>

<script>
import OwnedAssetsLoaderMixin from '@/vue/mixins/owned-assets-loader.mixin'
import FormMixin from '@/vue/mixins/form.mixin'

import Loader from '@/vue/common/Loader'

import { Sdk } from '@/sdk'
import { base } from '@tokend/js-sdk'

import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'

import { FileUtil } from '@/js/utils/file.util'
import { documentContainer } from '@validators'

export default {
  name: 'pre-issuance-form',
  components: {
    Loader,
  },
  mixins: [OwnedAssetsLoaderMixin, FormMixin],
  data: _ => ({
    preIssuanceDocument: null,
    issuance: null,
    isLoaded: false,
  }),
  validations: {
    preIssuanceDocument: { documentContainer },
  },
  watch: {
    'preIssuanceDocument': async function (value) {
      if (value && value.file) {
        await this.extractPreIssuanceRequest(value.file)
      }
    },
  },
  async created () {
    await this.loadOwnedAssets()
    this.isLoaded = true
  },
  methods: {
    async submit () {
      if (!this.preIssuanceDocument) {
        Bus.error('file-field.file-not-selected-err')
        return
      }
      this.disableForm()
      try {
        const operation = base.PreIssuanceRequestOpBuilder
          .createPreIssuanceRequestOp({
            request: this.issuance.xdr,
          })
        await Sdk.horizon.transactions.submitOperations(operation)
        Bus.success('issuance.pre-issuance-uploaded-msg')
        this.reset()
      } catch (e) {
        ErrorHandler.process(e)
      }
      this.enableForm()
    },
    async extractPreIssuanceRequest (file) {
      try {
        const extracted = await FileUtil.getText(file)
        this.parsePreIssuance(JSON.parse(extracted).issuances[0])
      } catch (e) {
        Bus.error('file-field.file-corrupted-err')
      }
    },
    parsePreIssuance (preIssuance) {
      const _xdr = base.xdr.PreIssuanceRequest
        .fromXDR(preIssuance.preEmission, 'hex')
      const result = base.PreIssuanceRequest.dataFromXdr(_xdr)
      result.xdr = _xdr
      result.isUsed = preIssuance.used

      if (!this.isAssetDefined(result.asset)) {
        Bus.error('issuance.pre-issuance-not-allowed-err')
        this.issuance = null
        this.disableForm()
        return
      }

      this.issuance = result
      this.enableForm()
    },
    isAssetDefined (assetCode) {
      return Boolean(this.ownedAssets
        .filter(item => item.code === assetCode).length
      )
    },
    reset () {
      this.issuance = null
      this.preIssuanceDocument = null
    },
  },
}
</script>

<style lang="scss" scoped>
@import './app-form';

.pre-issuance-form__submit-btn {
  @include button-raised();

  margin-bottom: 2rem;
  width: 18rem;
}

.pre-issuance-form__issuance-details {
  margin-top: 2rem;
}
</style>
