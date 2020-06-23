<template>
  <form
    class="app__form advanced-step-form"
    @submit.prevent="confirm()"
  >
    <template v-if="former.isCreateMode">
      <h3 class="advanced-step-form__subheading app__form-subheading">
        {{ 'asset-form.issuance-subheading' | globalize }}
      </h3>

      <div class="app__form-row">
        <div class="app__form-field">
          <tick-field
            class="advanced-step-form__pre-issuance-tick-field"
            v-model="form.isMaxAmountRestricted"
            :disabled="isDisabled"
          >
            {{ 'asset-form.restrict-max-amount-check' | globalize }}
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
              :label="'asset-form.max-issuance-amount-lbl' | globalize"
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
              {{ 'asset-form.additional-issuance-check' | globalize }}
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
                :label="'asset-form.pre-issuance-signer-lbl' | globalize"
                :error-message="getFieldErrorMessage(
                  'form.preIssuanceAssetSigner',
                )"
                :disabled="isDisabled"
              />
              <button
                v-ripple
                type="button"
                class="app__button-flat advanced-step-form__use-my-address-btn"
                :disabled="isDisabled"
                @click="form.preIssuanceAssetSigner = accountId"
              >
                {{ 'asset-form.use-my-account-id-btn' | globalize }}
              </button>
            </div>

            <vue-markdown
              v-if="form.preIssuanceAssetSigner === accountId"
              class="advanced-step-form__pre-issuance-disclaimer"
              :source="'asset-form.pre-issuance-disclaimer' | globalize"
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
              :label="'asset-form.preissued-amount-lbl' | globalize"
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
              {{ 'asset-form.pre-issuance-guide-link' | globalize }}
              <!-- eslint-disable-next-line max-len -->
              <i class="mdi mdi-launch advanced-step-form__pre-issuance-guide-link-launch-icon" />
            </router-link>
          </div>
        </div>
      </template>

      <h3 class="advanced-step-form__subheading app__form-subheading">
        {{ 'asset-form.permissions-subheading' | globalize }}
      </h3>

      <div class="app__form-row">
        <div class="app__form-field">
          <tick-field
            class="advanced-step-form__stellar-integration-tick-field"
            v-model="form.isUsageRestricted"
            :disabled="isDisabled"
            :cb-value="true"
          >
            {{ 'asset-form.restrict-who-can-use' | globalize }}
          </tick-field>
        </div>
      </div>

      <template v-if="form.isUsageRestricted">
        <div class="app__form-row">
          <div class="app__form-field">
            <select-field
              v-model="form.assetType"
              name="create-asset-type"
              :label="'asset-form.asset-type-lbl' | globalize"
              @blur="touchField('form.assetType')"
              :error-message="getFieldErrorMessage('form.assetType')"
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
    </template>

    <h3 class="advanced-step-form__subheading app__form-subheading">
      {{ 'asset-form.stellar' | globalize }}
    </h3>

    <div class="app__form-row">
      <div class="app__form-field">
        <tick-field
          class="advanced-step-form__stellar-integration-tick-field"
          v-model="form.isStellarIntegration"
          :disabled="isDisabled || form.isErc20Integration"
          :cb-value="true"
        >
          {{ 'asset-form.integration-with-stellar' | globalize }}
        </tick-field>
      </div>
    </div>

    <template v-if="form.isStellarIntegration && !form.isErc20Integration">
      <div class="app__form-row">
        <div class="app__form-field">
          <tick-field
            v-model="form.stellar.deposit"
            :disabled="isDisabled"
            :cb-value="true"
          >
            {{ 'asset-form.deposit-lbl' | globalize }}
          </tick-field>
        </div>
      </div>
      <div class="app__form-row">
        <div class="app__form-field">
          <tick-field
            v-model="form.stellar.withdraw"
            :disabled="isDisabled"
            :cb-value="true"
          >
            {{ 'asset-form.withdraw-lbl' | globalize }}
          </tick-field>
        </div>
      </div>
      <div class="app__form-row">
        <div class="app__form-field">
          <select-field
            v-model="form.stellar.assetType"
            name="create-asset-type"
            :label="'asset-form.stellar-type-lbl' | globalize"
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
            :label="'asset-form.code-lbl' | globalize"
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
      {{ 'asset-form.erc20' | globalize }}
    </h3>

    <div class="app__form-row">
      <div class="app__form-field">
        <tick-field
          class="advanced-step-form__stellar-integration-tick-field"
          v-model="form.isErc20Integration"
          :disabled="isDisabled || form.isStellarIntegration"
          :cb-value="true"
        >
          {{ 'asset-form.integration-with-erc20' | globalize }}
        </tick-field>
      </div>
    </div>

    <template v-if="form.isErc20Integration && !form.isStellarIntegration">
      <div class="app__form-row">
        <div class="app__form-field">
          <tick-field
            v-model="form.erc20.deposit"
            :disabled="isDisabled"
            :cb-value="true"
          >
            {{ 'asset-form.deposit-lbl' | globalize }}
          </tick-field>
        </div>
      </div>
      <div class="app__form-row">
        <div class="app__form-field">
          <tick-field
            v-model="form.erc20.withdraw"
            :disabled="isDisabled"
            :cb-value="true"
          >
            {{ 'asset-form.withdraw-lbl' | globalize }}
          </tick-field>
        </div>
      </div>
      <div class="app__form-row">
        <div class="app__form-field">
          <input-field
            white-autofill
            v-model="form.erc20.address"
            name="create-erc20-asset-code"
            :label="'asset-form.address-lbl' | globalize"
            @blur="touchField('form.erc20.address')"
            :error-message="getFieldErrorMessage('form.erc20.address')"
            :disabled="isDisabled"
          />
        </div>
      </div>
    </template>

    <h3 class="advanced-step-form__subheading app__form-subheading">
      {{ 'asset-form.terms-subheading' | globalize }}
    </h3>

    <div class="app__form-row">
      <div class="app__form-field">
        <file-field
          v-model="form.terms"
          name="create-asset-terms"
          :note="'asset-form.terms-note' | globalize"
          :file-extensions="['jpg', 'png', 'pdf']"
          :document-type="DOCUMENT_TYPES.assetTerms"
          :label="'asset-form.terms-lbl' | globalize"
          :disabled="isDisabled"
        />
      </div>
    </div>

    <div class="app__form-actions">
      <form-confirmation
        v-if="formMixin.isConfirmationShown"
        @ok="hideConfirmation() || next()"
        @cancel="hideConfirmation() || $emit('update:isDisabled', false)"
      />

      <button
        v-else
        v-ripple
        type="submit"
        class="app__button-raised advanced-step-form__btn"
        :disabled="isDisabled"
      >
        <template v-if="former.isUpdateRequest">
          {{ 'asset-form.update-request-btn' | globalize }}
        </template>

        <template v-else>
          {{ 'asset-form.create-request-btn' | globalize }}
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
import {
  STELLAR_TYPES,
  STELLAR_ASSET_TYPES,
  CREDIT_ALPHANUM4_MAX_LENGTH,
  CREDIT_ALPHANUM12_MIN_LENGTH,
  CREDIT_ALPHANUM12_MAX_LENGTH,
  NATIVE_XLM_TYPE,
} from '@/js/const/asset-subtypes.const'
import { AssetFormer } from '@/js/formers/AssetFormer'

export default {
  name: 'advanced-step-form',
  components: { VueMarkdown },
  mixins: [FormMixin],
  props: {
    former: { type: AssetFormer, required: true },
    isDisabled: { type: Boolean, default: false },
  },

  data () {
    const attrs = this.former.attrs
    const defaultAssetType = store.getters[vuexTypes.kvAssetTypeDefault]
    const isCreateMode = this.former.isCreateMode

    const isMaxAmountRestricted = isCreateMode &&
      attrs.maxIssuanceAmount &&
      attrs.maxIssuanceAmount !== this.MAX_AMOUNT

    const isPreIssuanceEnabled = isCreateMode &&
      attrs.preIssuanceAssetSigner &&
      attrs.preIssuanceAssetSigner !== config.NULL_ASSET_SIGNER

    const isUsageRestricted = isCreateMode &&
      attrs.assetType &&
      attrs.assetType !== defaultAssetType

    const isStellarIntegration = Boolean(attrs.stellarIntegration && (
      attrs.stellarIntegration.isWithdrawable ||
      attrs.stellarIntegration.isDepositable ||
      attrs.stellarIntegration.assetType ||
      attrs.stellarIntegration.assetCode
    ))

    const isErc20Integration = Boolean(attrs.erc20Integration && (
      attrs.erc20Integration.isWithdrawable ||
      attrs.erc20Integration.isDepositable ||
      attrs.erc20Integration.address
    ))

    return {
      form: {
        isMaxAmountRestricted,
        maxIssuanceAmount: isMaxAmountRestricted
          ? attrs.maxIssuanceAmount
          : '',

        isPreIssuanceEnabled,
        preIssuanceAssetSigner: isPreIssuanceEnabled
          ? attrs.preIssuanceAssetSigner
          : '',
        initialPreissuedAmount: isPreIssuanceEnabled
          ? attrs.initialPreissuedAmount
          : '',

        isUsageRestricted,
        assetType: isUsageRestricted ? attrs.assetType : '',

        isStellarIntegration,
        stellar: isStellarIntegration
          ? {
            withdraw: attrs.stellarIntegration.isWithdrawable,
            deposit: attrs.stellarIntegration.isDepositable,
            assetType: attrs.stellarIntegration.assetType,
            assetCode: attrs.stellarIntegration.assetCode,
          } : {
            withdraw: false,
            deposit: false,
            assetType: '',
            assetCode: '',
          },

        isErc20Integration,
        erc20: isErc20Integration
          ? {
            withdraw: attrs.erc20Integration.isWithdrawable,
            deposit: attrs.erc20Integration.isDepositable,
            address: attrs.erc20Integration.address,
          } : {
            withdraw: false,
            deposit: false,
            address: '',
          },

        terms: attrs.terms,
      },
      MIN_AMOUNT: config.MIN_AMOUNT,
      MAX_AMOUNT: config.MAX_AMOUNT,
      DOCUMENT_TYPES,
      STELLAR_ASSET_TYPES,
      STELLAR_TYPES,
      vueRoutes,
    }
  },

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
              return this.form.isStellarIntegration
            }),
          },
          assetCode: {
            required: requiredIf(function () {
              return this.form.isStellarIntegration
            }),
          },
        },
        erc20: {
          address: {
            required: requiredIf(function () {
              return this.form.isErc20Integration
            }),
          },
        },
      },
    }

    if (this.form.isStellarIntegration) {
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
      if (this.form.stellar.assetType === STELLAR_TYPES.creditAlphanum4) {
        return CREDIT_ALPHANUM4_MAX_LENGTH
      } else {
        return CREDIT_ALPHANUM12_MAX_LENGTH
      }
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
    'form.isStellarIntegration' (val) {
      if (val) this.form.isErc20Integration = false
    },
    'form.isErc20Integration' (val) {
      if (val) this.form.isStellarIntegration = false
    },
  },

  methods: {
    confirm () {
      if (!this.isFormValid()) return
      this.showConfirmation()
      this.$emit('update:isDisabled', true)
    },

    next () {
      if (!this.isFormValid()) return

      this.former.collect({
        maxIssuanceAmount: this.form.maxIssuanceAmount,
        preIssuanceAssetSigner: this.form.preIssuanceAssetSigner,
        initialPreissuedAmount: this.form.initialPreissuedAmount,
        assetType: this.form.assetType,
        stellarIntegration: this.form.isStellarIntegration ? {
          isWithdrawable: this.form.stellar.withdraw,
          isDepositable: this.form.stellar.deposit,
          assetType: this.form.stellar.assetType,
          assetCode: this.form.stellar.assetCode,
        } : {},
        erc20Integration: this.form.isErc20Integration ? {
          isWithdrawable: this.form.erc20.withdraw,
          isDepositable: this.form.erc20.deposit,
          address: this.form.erc20.address,
        } : {},
        terms: this.form.terms,
      })
      this.$emit('next')
    },

    translateAssetType (value) {
      const translationId = {
        [+this.kvAssetTypeDefault]: 'asset-form.verification-not-required-lbl',
        [+this.kvAssetTypeKycRequired]: 'asset-form.verification-required-lbl',
        [+this.kvAssetTypeSecurity]: 'asset-form.security-asset-lbl',
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

.advanced-step-form__use-my-address-btn {
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
