<template>
  <div class="issuance-section">
    <h3 class="issuance-section__subheading app__form-subheading">
      {{ 'asset-form.issuance-subheading' | globalize }}
    </h3>

    <div class="app__form-row">
      <div class="app__form-field">
        <tick-field
          class="issuance-section__pre-issuance-tick-field"
          v-model="form.isMaxAmountRestricted"
          @input="onMaxAmountToggle"
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
            :min="$config.MIN_AMOUNT"
            :max="$config.MAX_AMOUNT"
            :step="$config.MIN_AMOUNT"
            v-model="form.maxIssuanceAmount"
            @blur="touchField('form.maxIssuanceAmount')"
            @change="former
              .setAttr('maxIssuanceAmount', form.maxIssuanceAmount)
            "
            name="create-asset-max-issuance-amount"
            :label="'asset-form.max-issuance-amount-lbl' | globalize"
            :error-message="getFieldErrorMessage('form.maxIssuanceAmount', {
              min: $config.MIN_AMOUNT,
              max: $config.MAX_AMOUNT,
            })"
            :disabled="isDisabled"
          />
        </div>
      </div>

      <div class="app__form-row">
        <div class="app__form-field">
          <tick-field
            class="issuance-section__pre-issuance-tick-field"
            v-model="form.isPreIssuanceEnabled"
            @input="onPreIssuanceToggle"
            :disabled="isDisabled"
          >
            {{ 'asset-form.additional-issuance-check' | globalize }}
          </tick-field>
        </div>
      </div>
    </template>

    <template v-if="form.isMaxAmountRestricted && form.isPreIssuanceEnabled">
      <div class="app__form-row">
        <div class="app__form-field">
          <div class="issuance-section__buttoned-field-wrp">
            <input-field
              white-autofill
              v-model="form.preIssuanceAssetSigner"
              @blur="touchField('form.preIssuanceAssetSigner')"
              @change="former
                .setAttr('preIssuanceAssetSigner', form.preIssuanceAssetSigner)
              "
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
              class="app__button-flat"
              :disabled="isDisabled"
              @click="populatePreIssuanceSigner"
            >
              {{ 'asset-form.use-my-account-id-btn' | globalize }}
            </button>
          </div>

          <vue-markdown
            v-if="form.preIssuanceAssetSigner === accountId"
            class="issuance-section__pre-iss-disclaimer"
            :source="'asset-form.pre-issuance-disclaimer' | globalize"
          />
        </div>
      </div>

      <div class="app__form-row">
        <div class="app__form-field">
          <input-field
            white-autofill
            type="number"
            :min="$config.MIN_AMOUNT"
            :max="form.maxIssuanceAmount"
            :step="$config.MIN_AMOUNT"
            v-model="form.initialPreissuedAmount"
            @blur="touchField('form.initialPreissuedAmount')"
            @change="former
              .setAttr('initialPreissuedAmount', form.initialPreissuedAmount)
            "
            name="create-asset-initial-preissued-amount"
            :label="'asset-form.preissued-amount-lbl' | globalize"
            :error-message="getFieldErrorMessage(
              'form.initialPreissuedAmount',
              { min: 0, max: form.maxIssuanceAmount }
            )"
            :disabled="isDisabled"
          />
          <router-link
            class="issuance-section__pre-iss-guide-link"
            :to="$routes.preIssuanceGuide"
            target="_blank"
            rel="noopener"
          >
            {{ 'asset-form.pre-issuance-guide-link' | globalize }}
            <i class="mdi mdi-launch" />
          </router-link>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import VueMarkdown from 'vue-markdown'
import config from '@/config'
import formMixin from '@/vue/mixins/form.mixin'
import { vuexTypes } from '@/vuex'
import { mapGetters } from 'vuex'
import { amountRange, requiredIf } from '@validators'
import { AssetFormer } from '@/js/formers/AssetFormer'

export default {
  name: 'issuance-section',

  components: { VueMarkdown },

  mixins: [formMixin],

  props: {
    former: { type: AssetFormer, required: true },
    isDisabled: { type: Boolean, default: false },
  },

  data () {
    return {
      form: {
        isMaxAmountRestricted: false,
        maxIssuanceAmount: '',
        isPreIssuanceEnabled: false,
        preIssuanceAssetSigner: '',
        initialPreissuedAmount: '',
      },
    }
  },

  computed: {
    ...mapGetters({ accountId: vuexTypes.accountId }),
  },

  validations () {
    const isMaxAmountRestricted = this.form.isMaxAmountRestricted
    const isPreIssuanceEnabled = this.form.isPreIssuanceEnabled
    return {
      form: {
        maxIssuanceAmount: {
          required: requiredIf(function () { return isMaxAmountRestricted }),
          amountRange: amountRange(config.MIN_AMOUNT, config.MAX_AMOUNT),
        },
        preIssuanceAssetSigner: {
          required: requiredIf(function () { return isPreIssuanceEnabled }),
        },
        initialPreissuedAmount: {
          required: requiredIf(function () { return isPreIssuanceEnabled }),
          amountRange: amountRange(0, this.maxIssuanceAmount),
        },
      },
    }
  },

  created () {
    this.populateForm()
  },

  methods: {
    populateForm () {
      const attrs = this.former.attrs
      const isMaxAmountRestricted = Boolean(
        attrs.maxIssuanceAmount &&
        attrs.maxIssuanceAmount !== config.MAX_AMOUNT,
      )
      const isPreIssuanceEnabled = Boolean(
        attrs.preIssuanceAssetSigner &&
        attrs.preIssuanceAssetSigner !== config.NULL_ASSET_SIGNER,
      )

      this.form.isMaxAmountRestricted = isMaxAmountRestricted
      this.form.maxIssuanceAmount =
        attrs.maxIssuanceAmount === config.MAX_AMOUNT
          ? ''
          : attrs.maxIssuanceAmount || ''

      this.form.isPreIssuanceEnabled = isPreIssuanceEnabled
      this.form.preIssuanceAssetSigner =
        attrs.preIssuanceAssetSigner === config.NULL_ASSET_SIGNER
          ? ''
          : attrs.preIssuanceAssetSigner || ''
      this.form.initialPreissuedAmount =
        attrs.initialPreissuedAmount === config.MAX_AMOUNT
          ? ''
          : attrs.initialPreissuedAmount || ''
    },

    onMaxAmountToggle (isEnabled) {
      if (isEnabled) {
        this.former.setAttr('maxIssuanceAmount', this.form.maxIssuanceAmount)
      } else {
        this.former.unsetAttr('maxIssuanceAmount')
      }

      this.onPreIssuanceToggle(this.form.isPreIssuanceEnabled && isEnabled)
    },

    onPreIssuanceToggle (isEnabled) {
      if (isEnabled) {
        this.former
          .setAttr('preIssuanceAssetSigner', this.form.preIssuanceAssetSigner)
          .setAttr('initialPreissuedAmount', this.form.initialPreissuedAmount)
      } else {
        this.former
          .unsetAttr('preIssuanceAssetSigner')
          .unsetAttr('initialPreissuedAmount')
      }
    },

    populatePreIssuanceSigner () {
      this.form.preIssuanceAssetSigner = this.accountId
      this.former.setAttr('preIssuanceAssetSigner', this.accountId)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';

.issuance-section__buttoned-field-wrp {
  display: grid;
  grid: auto / 1fr auto;
  gap: 0.8rem;
}

.issuance-section__pre-iss-disclaimer {
  font-size: 1.4rem;
  margin-top: 1rem;
}

.issuance-section__pre-iss-guide-link {
  text-decoration: none;
  border-bottom: 0.1rem solid $col-link;
  display: inline-block;
  margin-top: 2.4rem;

  & > .mdi {
    font-size: 1.4rem;
  }

  &:visited {
    color: $col-primary;
  }
}
</style>
