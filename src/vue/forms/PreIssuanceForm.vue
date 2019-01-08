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
      v-if="issuances.length"
      class="pre-issuance-form__info"
    >
      <h3>{{ 'issuance.pre-issuance-info-title' | globalize }}</h3>
      <table class="app__table">
        <thead>
          <th>{{ 'issuance.asset-lbl' | globalize }}</th>
          <th>{{ 'issuance.amount-lbl' | globalize }}</th>
        </thead>
        <tbody>
          <tr v-for="issuance in issuances" :key="issuance.asset">
            <td>
              {{ issuance.asset }}
            </td>
            <td>
              {{
                issuance.amount | formatMoney
              }}
            </td>
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
    issuances: []
  }),
  watch: {
    'documents.preIssuance': async function (value) {
      if (value) {
        try {
          const extracted = await FileUtil.getText(value.file)
          this.parsePreIssuances(JSON.parse(extracted).issuances)
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
        Bus.error('file-field.file-not-selected')
        return
      }
      this.disableForm()
      try {
        const issuance = this.issuances[0]
        const operation = base.PreIssuanceRequestOpBuilder
          .createPreIssuanceRequestOp({
            request: issuance.xdr
          })
        await Sdk.horizon.transactions.submitOperations(operation)
        Bus.success('issuance.pre-issuance-uploaded')
        this.closeForm()
      } catch (e) {
        console.error(e)
        ErrorHandler.process(e)
      }
      this.enableForm()
    },
    cancelForm () {
      this.$emit('cancel')
    },
    parsePreIssuances (issuances) {
      const items = issuances
        .map(item => {
          const _xdr = base.xdr.PreIssuanceRequest
            .fromXDR(item.preEmission, 'hex')
          const result = base.PreIssuanceRequest.dataFromXdr(_xdr)
          result.xdr = _xdr
          result.isUsed = item.used
          return result
        })
        .filter(item => {
          return !this.issuances.find(el => el.reference === item.reference)
        })
      for (let i = 0; i < items.length; i++) {
        const assetCode = items[i].asset
        if (!this.isAssetDefined(assetCode)) {
          Bus.error('issuance.pre-issuance-not-allowed')
          this.issuances = []
          this.disableForm()
          return
        }
      }
      this.issuances = items
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
