<template>
  <form
    class="app__form issuance-form"
    @submit.prevent="submit"
  >
    <div class="app__form-row">
      <div class="app__form-field">
        <file-field
          :label="'issuance.pre-issuance-lbl' | globalize"
          :note="'issuance.file-type-lbl' | globalize"
          accept=".iss"
          v-model="documents.preIssuance"
        />
      </div>
    </div>
    <div
      v-if="issuance"
      class="pre-issuance-form__info"
    >
      <h3>{{ 'issuance.pre-issuance-info-title' | globalize }}</h3>
      <table class="app__table">
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
    <div class="app__form-actions">
      <button
        v-ripple
        type="submit"
        class="issuance-form__submit-btn"
        :disabled="formMixin.isDisabled"
      >
        {{ 'issuance.upload-btn' | globalize }}
      </button>
      <button
        v-ripple
        type="button"
        class="issuance-form__cancel-btn"
        @click.prevent="cancelForm"
      >
        {{ 'issuance.cancel-btn' | globalize }}
      </button>
    </div>
  </form>
</template>

<script>
import IssuanceFormMixin from '@/vue/mixins/issuance-form.mixin'

import { Sdk } from '@/sdk'
import { base } from '@tokend/js-sdk'

import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'

import { FileUtil } from '@/js/utils/file.util'

export default {
  name: 'pre-issuance-form',
  mixins: [IssuanceFormMixin],
  data: _ => ({
    documents: {
      preIssuance: null
    },
    issuance: null
  }),
  watch: {
    'documents.preIssuance': async function (value) {
      if (value) {
        try {
          const extracted = await FileUtil.getText(value.file)
          this.parsePreIssuance(JSON.parse(extracted).issuances[0])
        } catch (e) {
          console.error(e)
          Bus.error('file-field.file-corrupted')
        }
      }
    }
  },
  async created () {
    this.disableForm()
    await this.loadAssets()
    this.enableForm()
  },
  methods: {
    async submit () {
      if (!this.documents.preIssuance) {
        Bus.error('file-field.file-not-selected-err')
        return
      }
      this.disableForm()
      try {
        const operation = base.PreIssuanceRequestOpBuilder
          .createPreIssuanceRequestOp({
            request: this.issuance.xdr
          })
        await Sdk.horizon.transactions.submitOperations(operation)
        Bus.success('issuance.pre-issuance-uploaded-msg')
        this.cancelForm()
      } catch (e) {
        console.error(e)
        ErrorHandler.process(e)
      }
      this.enableForm()
    },
    cancelForm () {
      this.$emit('cancel')
    },
    parsePreIssuance (issuance) {
      const _xdr = base.xdr.PreIssuanceRequest
        .fromXDR(issuance.preEmission, 'hex')
      const result = base.PreIssuanceRequest.dataFromXdr(_xdr)
      result.xdr = _xdr
      result.isUsed = issuance.used

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
    }
  }
}
</script>

<style lang="scss" scoped>
@import './app-form';
@import './issuance-form';
</style>
