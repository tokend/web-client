<template>
  <form
    class="app__form advanced-step-form"
    @submit.prevent="isFormValid() && setConfirmationState()"
  >
    <!-- eslint-disable-next-line max-len -->

    <h3 class="advanced-step-form__subheading app__form-subheading">
      {{ 'create-asset-form.issuance-subheading' | globalize }}
    </h3>

    <div class="app__form-row">
      <div class="app__form-field">
        <tick-field
          class="advanced-step-form__pre-issuance-tick-field"
          v-model="form.isMaxAmountRestricted"
          :disabled="isDisabled"
        >
          {{ 'create-asset-form.restrict-max-amount-check' | globalize }}
        </tick-field>
      </div>
    </div>

    <template v-if="form.isMaxAmountRestricted">
      <div class="app__form-row">
        <div class="app__form-field">
          <input-field
            white-autofill
            type="number"
            :min="0"
            :max="MAX_AMOUNT"
            :step="MIN_AMOUNT"
            v-model="form.maxIssuanceAmount"
            @blur="touchField('form.maxIssuanceAmount')"
            name="create-asset-max-issuance-amount"
            :label="'create-asset-form.max-issuance-amount-lbl' | globalize"
            :error-message="getFieldErrorMessage(
              'form.maxIssuanceAmount', { from: MIN_AMOUNT, to: MAX_AMOUNT }
            )"
            :disabled="isDisabled"
          />
        </div>
      </div>

      <div class="app__form-row">
        <div class="app__form-field">
          <tick-field
            class="advanced-step-form__pre-issuance-tick-field"
            v-model="form.isPreIssuanceEnabled"
            :disabled="isDisabled"
          >
            {{ 'create-asset-form.additional-issuance-check' | globalize }}
          </tick-field>
        </div>
      </div>
    </template>

    <template v-if="form.isPreIssuanceEnabled">
      <div class="app__form-row">
        <div class="app__form-field">
          <div class="advanced-step-form__pre-issued-asset-signer-wrp">
            <input-field
              white-autofill
              v-model="form.preIssuanceAssetSigner"
              @blur="touchField('form.preIssuanceAssetSigner')"
              name="create-asset-pre-issuance-asset-signer"
              :label="'create-asset-form.pre-issuance-signer-lbl' | globalize"
              :error-message="getFieldErrorMessage(
                'form.preIssuanceAssetSigner',
              )"
              :disabled="isDisabled"
            />
            <button
              v-ripple
              type="button"
              class="app__button-flat advanced-step-form__insert-account-id-btn"
              :disabled="isDisabled"
              @click="form.preIssuanceAssetSigner = accountId"
            >
              {{ 'create-asset-form.use-my-account-id-btn' | globalize }}
            </button>
          </div>

          <vue-markdown
            v-if="form.preIssuanceAssetSigner === accountId"
            class="advanced-step-form__pre-issuance-disclaimer"
            :source="'create-asset-form.pre-issuance-disclaimer' | globalize"
          />
        </div>
      </div>

      <div class="app__form-row">
        <div class="app__form-field">
          <input-field
            white-autofill
            type="number"
            :min="0"
            :max="form.maxIssuanceAmount"
            :step="MIN_AMOUNT"
            v-model="form.initialPreissuedAmount"
            @blur="touchField('form.initialPreissuedAmount')"
            name="create-asset-initial-preissued-amount"
            :label="'create-asset-form.preissued-amount-lbl' | globalize"
            :error-message="getFieldErrorMessage(
              'form.initialPreissuedAmount',
              { from: 0, to: form.maxIssuanceAmount }
            )"
            :disabled="isDisabled"
          />
          <router-link
            class="advanced-step-form__pre-issuance-guide-link"
            :to="vueRoutes.preIssuanceGuide"
            target="_blank"
            rel="noopener"
          >
            {{ 'create-asset-form.pre-issuance-guide-link' | globalize }}
            <!-- eslint-disable-next-line max-len -->
            <i class="mdi mdi-launch advanced-step-form__pre-issuance-guide-link-launch-icon" />
          </router-link>
        </div>
      </div>
    </template>

    <h3 class="advanced-step-form__subheading app__form-subheading">
      {{ 'create-asset-form.permissions-subheading' | globalize }}
    </h3>

    <div class="app__form-row">
      <div class="app__form-field">
        <tick-field
          class="advanced-step-form__stellar-integration-tick-field"
          v-model="form.isUsageRestricted"
          :disabled="isDisabled"
          :cb-value="true"
        >
          {{ 'create-asset-form.restrict-who-can-use' | globalize }}
        </tick-field>
      </div>
    </div>

    <template v-if="form.isUsageRestricted">
      <div class="app__form-row">
        <div class="app__form-field">
          <select-field
            v-model="form.assetType"
            name="create-asset-type"
            :label="'create-asset-form.asset-type-lbl' | globalize"
            @blur="touchField('form.assetType')"
            :error-message="getFieldErrorMessage(
              'form.assetType',
            )"
            :disabled="isDisabled"
          >
            <option :value="kvAssetTypeDefault">
              {{ translateAssetType(kvAssetTypeDefault) }}
            </option>
            <option :value="kvAssetTypeKycRequired">
              {{ translateAssetType(kvAssetTypeKycRequired) }}
            </option>
            <option :value="kvAssetTypeSecurity">
              {{ translateAssetType(kvAssetTypeSecurity) }}
            </option>
          </select-field>
        </div>
      </div>
    </template>

    <h3 class="advanced-step-form__subheading app__form-subheading">
      {{ 'create-asset-form.stellar' | globalize }}
    </h3>

    <div class="app__form-row">
      <div class="app__form-field">
        <tick-field
          class="advanced-step-form__stellar-integration-tick-field"
          v-model="form.isStellarIntegrationEnabled"
          :disabled="isDisabled"
          :cb-value="true"
        >
          {{ 'create-asset-form.integration-with-stellar' | globalize }}
        </tick-field>
      </div>
    </div>

    <template v-if="form.isStellarIntegrationEnabled">
      <div class="app__form-row">
        <div class="app__form-field">
          <tick-field
            v-model="form.stellar.deposit"
            :disabled="formMixin.isDisabled"
            :cb-value="true"
          >
            {{ 'create-asset-form.deposit-lbl' | globalize }}
          </tick-field>
        </div>
      </div>
      <div class="app__form-row">
        <div class="app__form-field">
          <tick-field
            v-model="form.stellar.withdraw"
            :disabled="formMixin.isDisabled"
            :cb-value="true"
          >
            {{ 'create-asset-form.withdraw-lbl' | globalize }}
          </tick-field>
        </div>
      </div>
      <div class="app__form-row">
        <div class="app__form-field">
          <select-field
            v-model="form.stellar.assetType"
            name="create-asset-type"
            :label="'create-asset-form.stellar-type-lbl' | globalize"
            @blur="touchField('form.stellar.assetType')"
            :error-message="getFieldErrorMessage(
              'form.stellar.assetType',
            )"
            :disabled="isDisabled"
          >
            <option
              v-for="item in STELLAR_ASSET_TYPES"
              :value="item.value"
              :key="item.translationId"
            >
              {{ item.translationId | globalize }}
            </option>
          </select-field>
        </div>
      </div>
      <div class="app__form-row">
        <div class="app__form-field">
          <input-field
            white-autofill
            v-model="form.stellar.assetCode"
            @blur="touchField('form.stellar.assetCode')"
            name="create-asset-stellar-code"
            :label="'create-asset-form.code-lbl' | globalize"
            :error-message="getFieldErrorMessage(
              'form.stellar.assetCode',
              {
                minLength: getAssetCodeMinLength,
                maxLength: getAssetCodeMaxLength
              }
            )"
            :disabled="isDisabled ||
              form.stellar.assetType === STELLAR_TYPES.native"
            :minlength="getAssetCodeMinLength"
            :maxlength="getAssetCodeMaxLength"
          />
        </div>
      </div>
    </template>

    <h3 class="advanced-step-form__subheading app__form-subheading">
      {{ 'create-asset-form.erc20' | globalize }}
    </h3>

    <div class="app__form-row">
      <div class="app__form-field">
        <tick-field
          class="advanced-step-form__stellar-integration-tick-field"
          v-model="form.isErc20IntegrationEnabled"
          :disabled="isDisabled"
          :cb-value="true"
        >
          {{ 'create-asset-form.integration-with-erc20' | globalize }}
        </tick-field>
      </div>
    </div>

    <template v-if="form.isErc20IntegrationEnabled">
      <div class="app__form-row">
        <div class="app__form-field">
          <tick-field
            v-model="form.erc20.deposit"
            :disabled="formMixin.isDisabled"
            :cb-value="true"
          >
            {{ 'create-asset-form.deposit-lbl' | globalize }}
          </tick-field>
        </div>
      </div>
      <div class="app__form-row">
        <div class="app__form-field">
          <tick-field
            v-model="form.erc20.withdraw"
            :disabled="formMixin.isDisabled"
            :cb-value="true"
          >
            {{ 'create-asset-form.withdraw-lbl' | globalize }}
          </tick-field>
        </div>
      </div>
      <div class="app__form-row">
        <div class="app__form-field">
          <input-field
            white-autofill
            v-model="form.erc20.address"
            name="create-erc20-asset-code"
            :label="'create-asset-form.address-lbl' | globalize"
            @blur="touchField('form.erc20.address')"
            :error-message="getFieldErrorMessage('form.erc20.address')"
            :disabled="formMixin.isDisabled"
          />
        </div>
      </div>
    </template>

    <h3 class="advanced-step-form__subheading app__form-subheading">
      {{ 'create-asset-form.terms-subheading' | globalize }}
    </h3>

    <div class="app__form-row">
      <div class="app__form-field">
        <file-field
          v-model="form.terms"
          name="create-asset-terms"
          :note="'create-asset-form.terms-note' | globalize"
          :file-extensions="['jpg', 'png', 'pdf']"
          :document-type="DOCUMENT_TYPES.assetTerms"
          :label="'create-asset-form.terms-lbl' | globalize"
          :disabled="isDisabled"
        />
      </div>
    </div>

    <div class="app__form-actions">
      <form-confirmation
        v-if="formMixin.isConfirmationShown"
        @ok="hideConfirmation() || submit()"
        @cancel="hideConfirmation() || emitEnabledState()"
      />

      <button
        v-else
        v-ripple
        type="submit"
        class="app__button-raised advanced-step-form__btn"
        :disabled="isDisabled"
      >
        <template v-if="request">
          {{ 'create-asset-form.update-request-btn' | globalize }}
        </template>

        <template v-else>
          {{ 'create-asset-form.create-request-btn' | globalize }}
        </template>
      </button>
    </div>
  </form>
</template>

<script>
// TODO: split to components

import FormMixin from '@/vue/mixins/form.mixin'

import VueMarkdown from 'vue-markdown'

import { DOCUMENT_TYPES } from '@/js/const/document-types.const'
import { DocumentContainer } from '@/js/helpers/DocumentContainer'

import { CreateAssetRequest } from '../wrappers/create-asset-request'

import config from '@/config'

import {
  amountRange,
  requiredIf,
  maxLength,
  alphaNum,
  minLength,
} from '@validators'
import { vueRoutes } from '@/vue-router/routes'
import { mapGetters } from 'vuex'
import { vuexTypes, store } from '@/vuex'

const EVENTS = {
  submit: 'submit',
  updateIsDisabled: 'update:isDisabled',
}

const STELLAR_TYPES = {
  creditAlphanum4: 'credit_alphanum4',
  creditAlphanum12: 'credit_alphanum12',
  native: 'native',
}

const STELLAR_ASSET_TYPES = [
  {
    translationId: 'create-asset-form.alphanumeric-4-lbl',
    value: STELLAR_TYPES.creditAlphanum4,
  },
  {
    translationId: 'create-asset-form.alphanumeric-12-lbl',
    value: STELLAR_TYPES.creditAlphanum12,
  },
  {
    translationId: 'create-asset-form.native-lbl',
    value: STELLAR_TYPES.native,
  },
]
const CREDIT_ALPHANUM4_MAX_LENGTH = 4
const CREDIT_ALPHANUM12_MIN_LENGTH = 5
const CREDIT_ALPHANUM12_MAX_LENGTH = 12
const NATIVE_XLM_TYPE = 'XLM'

export default {
  name: 'advanced-step-form',
  components: { VueMarkdown },
  mixins: [FormMixin],
  props: {
    request: { type: CreateAssetRequest, default: null },
    isDisabled: { type: Boolean, default: false },
  },

  data: _ => ({
    form: {
      isMaxAmountRestricted: false,
      maxIssuanceAmount: '',
      isPreIssuanceEnabled: false,
      isUsageRestricted: false,
      isStellarIntegrationEnabled: false,
      isErc20IntegrationEnabled: false,
      assetType: store
        ? String(store.getters[vuexTypes.kvAssetTypeDefault])
        : '0',
      preIssuanceAssetSigner: '',
      initialPreissuedAmount: '',
      terms: null,
      stellar: {
        withdraw: false,
        deposit: false,
        assetType: '',
        assetCode: '',
      },
      erc20: {
        withdraw: false,
        deposit: false,
        address: '',
      },
    },
    MIN_AMOUNT: config.MIN_AMOUNT,
    MAX_AMOUNT: config.MAX_AMOUNT,
    DOCUMENT_TYPES,
    STELLAR_ASSET_TYPES,
    CREDIT_ALPHANUM4_MAX_LENGTH,
    CREDIT_ALPHANUM12_MAX_LENGTH,
    CREDIT_ALPHANUM12_MIN_LENGTH,
    STELLAR_TYPES,
    vueRoutes,
  }),

  validations () {
    let validations = {
      form: {
        maxIssuanceAmount: {
          required: requiredIf(function () {
            return this.form.isMaxAmountRestricted
          }),
          amountRange: amountRange(this.MIN_AMOUNT, this.MAX_AMOUNT),
        },
        preIssuanceAssetSigner: {
          required: requiredIf(function () {
            return this.form.isPreIssuanceEnabled
          }),
        },
        initialPreissuedAmount: {
          required: requiredIf(function () {
            return this.form.isPreIssuanceEnabled
          }),
          amountRange: amountRange(
            0,
            this.maxIssuanceAmount,
          ),
        },
        assetType: {
          required: requiredIf(function () {
            return this.form.isUsageRestricted
          }),
        },
        stellar: {
          assetType: {
            required: requiredIf(function () {
              return this.form.isStellarIntegrationEnabled
            }),
          },
          assetCode: {
            required: requiredIf(function () {
              return this.form.isStellarIntegrationEnabled
            }),
          },
        },
        erc20: {
          address: {
            required: requiredIf(function () {
              return this.form.isErc20IntegrationEnabled
            }),
          },
        },
      },
    }
    if (this.form.isStellarIntegrationEnabled) {
      const stellarAssetCode =
        validations.form.stellar.assetCode

      switch (this.form.stellar.assetType) {
        case STELLAR_TYPES.creditAlphanum4:
          stellarAssetCode.maxLength = maxLength(CREDIT_ALPHANUM4_MAX_LENGTH)
          stellarAssetCode.alphaNum = alphaNum
          break
        case STELLAR_TYPES.creditAlphanum12:
          stellarAssetCode.minLength = minLength(CREDIT_ALPHANUM12_MIN_LENGTH)
          stellarAssetCode.maxLength = maxLength(CREDIT_ALPHANUM12_MAX_LENGTH)
          stellarAssetCode.alphaNum = alphaNum
          break
      }
    }
    return validations
  },

  computed: {
    ...mapGetters([
      vuexTypes.kvAssetTypeDefault,
      vuexTypes.kvAssetTypeKycRequired,
      vuexTypes.kvAssetTypeSecurity,
      vuexTypes.accountId,
    ]),
    getAssetCodeMaxLength () {
      /* eslint-disable max-len */
      if (this.form.stellar.assetType === STELLAR_TYPES.creditAlphanum4) {
        return CREDIT_ALPHANUM4_MAX_LENGTH
      } else {
        return CREDIT_ALPHANUM12_MAX_LENGTH
      }
      /* eslint-enable max-len */
    },
    getAssetCodeMinLength () {
      if (this.form.stellar.assetType === STELLAR_TYPES.creditAlphanum4) {
        return CREDIT_ALPHANUM4_MAX_LENGTH
      } else {
        return CREDIT_ALPHANUM12_MIN_LENGTH
      }
    },
  },

  watch: {
    'form.stellar.assetType' (val) {
      if (val === STELLAR_TYPES.native) {
        this.form.stellar.assetCode = NATIVE_XLM_TYPE
      }
    },
  },

  created () {
    if (this.request) {
      this.populateForm()
    }
  },

  methods: {
    populateForm () {
      const isMaxAmountRestricted = this.request.maxIssuanceAmount &&
        this.request.maxIssuanceAmount !== this.MAX_AMOUNT

      const isPreIssuanceEnabled =
        this.request.preIssuanceAssetSigner !== config.NULL_ASSET_SIGNER

      const isUsageRestricted = this.request.assetType &&
        this.request.assetType !== this.kvAssetTypeDefault

      this.form = {
        isMaxAmountRestricted,
        maxIssuanceAmount: isMaxAmountRestricted
          ? this.request.maxIssuanceAmount
          : '',
        isPreIssuanceEnabled,
        preIssuanceAssetSigner: isPreIssuanceEnabled
          ? this.request.preIssuanceAssetSigner
          : '',
        initialPreissuedAmount: isPreIssuanceEnabled
          ? this.request.initialPreissuedAmount
          : '',
        isUsageRestricted,
        assetType: String(this.request.assetType),
        terms: this.request.termsKey
          ? new DocumentContainer(this.request.terms)
          : null,
      }
    },

    submit () {
      if (this.isFormValid()) {
        this.$emit(EVENTS.submit, this.form)
      }
    },

    setConfirmationState () {
      this.showConfirmation()
      this.emitDisabledState()
    },

    emitDisabledState () {
      this.$emit(EVENTS.updateIsDisabled, true)
    },

    emitEnabledState () {
      this.$emit(EVENTS.updateIsDisabled, false)
    },

    translateAssetType (value) {
      const translationId = {
        [+this.kvAssetTypeDefault]: 'create-asset-form.verification-not-required-lbl',
        [+this.kvAssetTypeKycRequired]: 'create-asset-form.verification-required-lbl',
        [+this.kvAssetTypeSecurity]: 'create-asset-form.security-asset-lbl',
      }[+value]

      return this.$options.filters.globalize(translationId)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/vue/forms/_app-form';
@import '~@scss/variables';

.advanced-step-form__btn {
  max-width: 14.4rem;
  width: 100%;
}

.advanced-step-form__pre-issued-asset-signer-wrp {
  display: flex;
  align-items: center;
}

.advanced-step-form__insert-account-id-btn {
  margin-left: 0.4rem;
}

.advanced-step-form__pre-issuance-disclaimer {
  font-size: 1.4rem;
  margin-top: 1rem;
}

.advanced-step-form__pre-issuance-tick-field {
  margin-bottom: 1rem;
}

.advanced-step-form__pre-issuance-guide-link {
  text-decoration: none;
  border-bottom: 0.1rem solid $col-link;
  display: inline-block;
  margin-top: 2.4rem;

  &:visited {
    color: $col-primary;
  }
}

.advanced-step-form__pre-issuance-guide-link-launch-icon {
  font-size: 1.4rem;
}

.advanced-step-form__subheading {
  margin: 0;

  &:not(:first-of-type) {
    margin-top: 3.2rem;
  }

  & + .app__form-row {
    margin-top: 1.2rem;
  }
}
</style>
