<template>
  <form
    class="app__form pre-issuance-form"
    @submit.prevent="submit"
  >
    <div class="app__form-row">
      <div class="app__form-field">
        <file-field
          :label="'issuance.pre-issuance-lbl' | globalize"
          :note="'issuance.file-type-note' | globalize"
          accept=".iss"
          v-model="preIssuanceDocument"
        />
      </div>
    </div>
    <div
      v-if="issuance"
      class="pre-issuance-form__issuance-details"
    >
      <h3>{{ 'issuance.pre-issuance-details-title' | globalize }}</h3>
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
        class="pre-issuance-form__submit-btn"
        :disabled="formMixin.isDisabled"
      >
        {{ 'issuance.upload-btn' | globalize }}
      </button>
      <button
        v-ripple
        type="button"
        class="pre-issuance-form__cancel-btn"
        @click.prevent="emitCancel"
      >
        {{ 'issuance.cancel-btn' | globalize }}
      </button>
    </div>
  </form>
</template>

<script>
import AssetLoaderMixin from '@/vue/mixins/asset-loader.mixin'

import { Sdk } from '@/sdk'
import { base } from '@tokend/js-sdk'

import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'

import { FileUtil } from '@/js/utils/file.util'

const EVENTS = {
  cancel: 'cancel'
}

export default {
  name: 'pre-issuance-form',
  mixins: [AssetLoaderMixin],
  data: _ => ({
    preIssuanceDocument: null,
    issuance: null
  }),
  watch: {
    'preIssuanceDocument': async function (value) {
      if (value.file) {
        await this.loadIssuance(value.file)
      }
    }
  },
  async created () {
    this.disableForm()
    await this.loadOwnedAssets()
    this.enableForm()
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
            request: this.issuance.xdr
          })
        await Sdk.horizon.transactions.submitOperations(operation)
        Bus.success('issuance.pre-issuance-uploaded-msg')
        this.emitCancel()
      } catch (e) {
        console.error(e)
        ErrorHandler.process(e)
      }
      this.enableForm()
    },
    emitCancel () {
      this.$emit(EVENTS.cancel)
    },
    async loadIssuance (file) {
      try {
        const extracted = await FileUtil.getText(file)
        this.parsePreIssuance(JSON.parse(extracted).issuances[0])
      } catch (e) {
        console.error(e)
        Bus.error('file-field.file-corrupted')
      }
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

.pre-issuance-form__submit-btn {
  @include button-raised();

  margin-bottom: 2rem;
  width: 18rem;
}

.pre-issuance-form__cancel-btn {
  @include button();

  padding-left: .1rem;
  padding-right: .1rem;
  margin-left: auto !important;
  margin-bottom: 2rem;
  font-weight: normal;
}

.pre-issuance-form__issuance-details {
  margin-top: 2rem;
}
</style>
