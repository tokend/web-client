<template>
  <div class="kyc-form">
    <h2 class="app__page-heading">{{ i18n.tokens_form_creation() }}</h2>
    <form
      novalidate
      @submit.prevent="submit"
    >
      <div class="kyc-form__content-item">
        <div class="md-layout-item">
          <file-field
            file-type="image"
            v-model="documents[documentTypes.tokenIcon]"
            :label="i18n.lbl_token_icon()"
            :min-width="120"
            :min-height="120"
            :accept="'image/*'"
            :type="documentTypes.tokenIcon"
          />
        </div>
      </div>
      <div class="kyc-form__content-item">
        <div class="app__form-row">
          <div class="app__form-field">
            <input-field-unchained
              id="token-name"
              v-model="request.tokenName"
              v-validate="'required'"
              :label="i18n.lbl_token_name()"
              name="token name"
              :disabled="isExistingAsset || isPending"
              :error-message="errorMessage('token name')"
            />
          </div>
          <div class="app__form-field">
            <input-field-unchained
              id="token-code"
              v-model="request.tokenCode"
              v-validate="'required'"
              :label="i18n.lbl_token_code()"
              name="token code"
              :disabled="isExistingAsset || isPending"
              :error-message="errorMessage('token code')"
            />
          </div>
        </div>
        <div class="app__form-row">
          <input-field-unchained
            id="token-max-issuance-amount"
            type="number"
            v-model="request.maxIssuanceAmount"
            v-validate="'required|amount'"
            :label="i18n.lbl_token_max_issuance_amount()"
            name="max issuance amount"
            :disabled="isExistingAsset || isPending"
            :error-message="errorMessage('max issuance amount')"
          />
        </div>
      </div>
      <div class="kyc-form__content-item">
        <div class="md-layout md-gutter">
          <div class="md-layout-item md-size-50">
            <tick-field
              v-model="request.policies"
              :cb-value="ASSET_POLICIES.transferable"
              name="policy-transferable"
              id="policy-transferable"
              class="md-primary"
            >
              {{ i18n.lbl_transferable() }}
            </tick-field>
          </div>
          <div class="md-layout-item md-size-50">
            <tick-field
              v-model="request.policies"
              :cb-value="ASSET_POLICIES.requiresKyc"
              name="policy-requiresKyc"
              id="policy-requiresKyc"
              class="md-primary"
            >
              {{ i18n.lbl_requires_kyc() }}
            </tick-field>
          </div>
        </div>
      </div>
      <div class="kyc-form__content-item">
        <div class="md-layout-item">
          <file-field
            class="token_terms__file-field"
            name="token terms document"
            v-model="documents[documentTypes.tokenTerms]"
            :label="i18n.lbl_token_terms()"
            id="document.id"
            :type="documentTypes.tokenTerms"
          />
        </div>
      </div>
      <div class="kyc-form__content-item">
        <tick-field
          v-model="makeAdditional"
          name="additional-issuance"
          id="additional-issuance"
        >
          {{ i18n.tokens_want_to_make_additional_issuance_later() }}
        </tick-field>
      </div>
      <div
        class="kyc-form__content-item"
        v-if="makeAdditional"
      >
        <!-- Transfrom to Boolean -->
        <div class="app__form-row">
          <input-field-unchained
            id="token-preissued-asset-signer"
            v-model="request.preissuedAssetSigner"
            v-validate="'required|account_id'"
            :label="i18n.lbl_token_preissued_asset_signer()"
            :disabled="isExistingAsset || isPending"
            :error-message="errorMessage('preissued asset signer')"
          />
        </div>
        <div class="app__form-row">
          <input-field-unchained
            id="token-initial-preissued-amount"
            name="initial preissued amount"
            v-model="request.initialPreissuedAmount"
            type="number"
            v-validate="{
              required:true,
              min_value: 0,
              max_value: request.maxIssuanceAmount
            }"
            :label="i18n.lbl_token_initial_preissued_amount()"
            :disabled="isExistingAsset || isPending"
            :error-message="errorMessage('initial preissued amount')"
          />
        </div>
      </div>
      <div class="app__form-actions">
        <button
          v-ripple
          type="submit"
          class="app__form-submit-btn"
          :disabled="isPending"
        >
          {{ i18n.lbl_submit() }}
        </button>
      </div>
    </form>

    <md-dialog :md-active.sync="showDialog">
      <md-dialog-title>Tell you something more</md-dialog-title>
      <div class="app__card-content">
        <p>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit.
          Ullam mollitia dolorum dolores quae commodi impedit possimus qui,
          atque at voluptates cupiditate. Neque quae culpa suscipit
          praesentium inventore ducimus ipsa aut.
        </p>
      </div>
      <md-dialog-actions>
        <button
          v-ripple
          @click="showDialog = false"
          class="app__button-flat"
        >
          {{ i18n.lbl_close() }}
        </button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
import FormMixin from 'L@/vue/common/mixins/form.mixin'
import FileField from 'L@/vue/common/fields/FileField'

import { i18n } from 'L@/js/i18n'
import { documentTypes } from 'L@/js/const/documents.const'

import { tokensService } from 'L@/js/services/tokens.service'
import { ASSET_POLICIES } from 'L@/js/const/xdr.const'
import { EventDispatcher } from 'L@/js/events/event_dispatcher'
import { ErrorHandler } from 'L@/js/errors/error_handler'

import { DocumentContainer } from 'L@/js/helpers/DocumentContainer'
import {
  reviewableRequestsService
} from 'L@/js/services/reviewable_requests.service'
import { fileService } from 'L@/js/services/file.service'
import { TokenCreationRecord } from 'L@/js/records/token_creation.record'
import config from '@/config'
import get from 'lodash/get'

export default {
  components: { FileField },
  mixins: [FormMixin],
  props: {
    id: { type: String, default: '' },
    code: { type: String, default: '' }
  },
  data: _ => ({
    request: {
      policies: []
    },
    token: null,
    documents: {
      [documentTypes.tokenTerms]: null,
      [documentTypes.tokenIcon]: null
    },
    makeAdditional: false,
    showDialog: false,
    i18n,
    documentTypes,
    ASSET_POLICIES
  }),

  computed: {
    isExistingAsset () {
      return !!this.code || !!this.token
    }
  },

  async created () {
    if (this.id || this.code) {
      if (this.id) {
        this.request = new TokenCreationRecord(
          await reviewableRequestsService.loadReviewableRequestById(this.id)
        )
        try {
          this.token = await tokensService
            .loadTokenByCode(this.request.tokenCode)
          if (this.token) {
            this.request = {
              ...this.request,
              preissuedAssetSigner: this.token.preissued_asset_signer,
              maxIssuanceAmount: this.token.max_issuance_amount,
              initialPreissuedAmount: this.token.issued
            }
          }
        } catch (e) {
          console.error(e)
        }
      } else if (this.code) {
        this.request = new TokenCreationRecord(
          await tokensService.loadTokenByCode(this.code)
        )
      }
      this.makeAdditional = true
      this.documents[documentTypes.tokenTerms] = get(this.request, 'terms.key')
        ? new DocumentContainer(this.request.terms)
        : null
      this.documents[documentTypes.tokenIcon] = get(this.request, 'logo.key')
        ? new DocumentContainer(this.request.logo)
        : null
    }
  },

  methods: {
    async submit () {
      if (!await this.isValid()) return
      this.disable()
      try {
        await this.createRequest()
        EventDispatcher.dispatchShowSuccessEvent(i18n.kyc_upload_success())
        this.$router.push({ path: '/requests', hash: '#token-creation' })
      } catch (error) {
        console.error(error)
        ErrorHandler.processUnexpected(error)
      }
      this.enable()
    },

    async createRequest () {
      let preissuedAssetSigner = config.NULL_ASSET_SIGNER
      let initialPreissuedAmount = this.request.maxIssuanceAmount

      if (this.makeAdditional || this.id) {
        preissuedAssetSigner = this.request.preissuedAssetSigner
        initialPreissuedAmount = this.request.initialPreissuedAmount
      }

      const logoContainer = this.documents[documentTypes.tokenIcon]
      const termsContainer = this.documents[documentTypes.tokenTerms]

      if (logoContainer && !logoContainer.isUploaded) {
        const logoKey = await fileService.uploadFile(
          logoContainer.getDetailsForUpload()
        )
        logoContainer.setKey(logoKey)
      }

      if (termsContainer && !termsContainer.isUploaded) {
        const termsKey = await fileService.uploadFile(
          termsContainer.getDetailsForUpload()
        )
        termsContainer.setKey(termsKey)
      }
      const opts = {
        requestID: this.request.id ? this.request.id : '0',
        code: this.request.tokenCode,
        policies: (this.request.policies).reduce((a, b) => (a | b), 0),
        details: {
          name: this.request.tokenName,
          logo: logoContainer ? logoContainer.getDetailsForSave() : {},
          terms: termsContainer ? termsContainer.getDetailsForSave() : {}
        }
      }

      if (this.code || this.token) {
        await tokensService.createTokenUpdateRequest(opts)
      } else {
        await tokensService.createTokenCreationRequest({
          ...opts,
          preissuedAssetSigner: preissuedAssetSigner,
          maxIssuanceAmount: this.request.maxIssuanceAmount,
          initialPreissuedAmount: initialPreissuedAmount
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.kyc-form__content-item:not(:last-child) {
  margin-bottom: 24px;
}
</style>
