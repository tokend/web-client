<template>
  <div class="erc20-section">
    <h3 class="advanced-step__subheading app__form-subheading">
      {{ 'asset-form.erc20' | globalize }}
    </h3>

    <div class="app__form-row">
      <div class="app__form-field">
        <tick-field
          class="advanced-step__stellar-integration-tick-field"
          v-model="form.isIntegrated"
          :disabled="isDisabled || isOtherIntegration"
          :cb-value="true"
        >
          {{ 'asset-form.integration-with-erc20' | globalize }}
        </tick-field>
      </div>
    </div>

    <template v-if="form.isIntegrated && !isOtherIntegration">
      <div class="app__form-row">
        <div class="app__form-field">
          <tick-field
            v-model="form.isDepositable"
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
            v-model="form.isWithdrawable"
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
            v-model="form.erc20Address"
            name="create-erc20-asset-code"
            :label="'asset-form.address-lbl' | globalize"
            :error-message="getFieldErrorMessage('form.erc20Address')"
            :disabled="isDisabled"
            @blur="touchField('form.erc20Address')"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import formMixin from '@/vue/mixins/form.mixin'
import { AssetFormer } from '@/js/formers/AssetFormer'
import { requiredIf } from '@validators'

export default {
  name: 'erc20-section',

  mixins: [formMixin],

  props: {
    former: { type: AssetFormer, required: true },
    onCollect: { type: Function, required: true },
    isDisabled: { type: Boolean, default: false },
    isOtherIntegration: { type: Boolean, default: false },
  },

  data () {
    const attrs = this.former.attrs.erc20Integration
    const isIntegrated = Boolean(attrs && (
      attrs.isWithdrawable ||
      attrs.isDepositable ||
      attrs.address
    ))

    return {
      form: {
        isIntegrated,
        isWithdrawable: isIntegrated ? attrs.isWithdrawable : false,
        isDepositable: isIntegrated ? attrs.isDepositable : false,
        erc20Address: isIntegrated ? attrs.address : '',
      },
      onCollectUnsubscriber: () => {},
    }
  },

  validations () {
    return {
      form: {
        erc20Address: {
          required: requiredIf(function () {
            return this.form.isIntegrated && !this.isOtherIntegration
          }),
        },
      },
    }
  },

  watch: {
    'form.isIntegrated': {
      immediate: true,
      handler (v) { this.$emit(v ? 'enabled' : 'disabled') },
    },
  },

  created () {
    this.onCollectUnsubscriber = this.onCollect(() => { this.collect() })
  },

  beforeDestroy () {
    this.onCollectUnsubscriber()
  },

  methods: {
    collect () {
      if (!this.form.isIntegrated || this.isOtherIntegration) {
        this.former.unsetAttr('erc20Integration')
        return
      }

      this.former.mergeAttrs({
        erc20Integration: {
          isWithdrawable: this.form.isWithdrawable,
          isDepositable: this.form.isDepositable,
          address: this.form.erc20Address,
        },
      })
    },
  },
}
</script>
