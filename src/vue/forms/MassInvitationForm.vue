<template>
  <div class="mass-invitation-form">
    <template v-if="ownedAssets.length">
      <form @submit.prevent="isFormValid() && showConfirmation()">
        <div class="app__form-row">
          <div class="app__form-field">
            <p class="mass-invitation-form__how-to-invitees">
              {{ 'mass-invitation-form.how-to-invitees-paragraph' | globalize }}
            </p>

            <textarea-field
              name="mass-invitation-invitees"
              v-model="form.invitees"
              :label="'mass-invitation-form.invitees-lbl' | globalize"
              :disabled="formMixin.isDisabled"
              @blur="touchField('form.invitees')"
              :error-message="getFieldErrorMessage('form.invitees')"
              rows="6"
            />
          </div>
        </div>

        <div class="app__form-row">
          <div class="app__form-field">
            <select-field
              name="mass-invitation-asset-code"
              v-model="form.assetCode"
              :label="'mass-invitation-form.asset-lbl' | globalize"
              @blur="touchField('form.assetCode')"
              :error-message="getFieldErrorMessage('form.assetCode')"
              :disabled="formMixin.isDisabled"
            >
              <option
                v-for="asset in ownedAssets"
                :key="asset.code"
                :value="asset.code"
              >
                {{ asset.nameAndCode }}
              </option>
            </select-field>

            <template v-if="form.assetCode">
              <p class="app__form-field-description">
                {{
                  'mass-invitation-form.available-for-issuance-hint' | globalize({
                    amount: {
                      value: assetByCode(form.assetCode).availableForIssuance,
                      currency: form.assetCode
                    }
                  })
                }}
              </p>
            </template>
          </div>
        </div>

        <div class="app__form-row">
          <div class="app__form-field">
            <amount-input-field
              v-model="form.amount"
              name="mass-invitation-amount"
              validation-type="issuance"
              :label="'mass-invitation-form.amount-lbl' | globalize"
              :asset="assetByCode(form.assetCode)"
              :disabled="formMixin.isDisabled"
            />
          </div>
        </div>

        <div class="app__form-actions">
          <form-confirmation
            v-if="formMixin.isConfirmationShown"
            :is-pending="formMixin.isPending"
            @cancel="hideConfirmation"
            @ok="hideConfirmationAfterSubmit(submit)"
          />

          <button
            v-else
            v-ripple
            :disabled="formMixin.isDisabled"
            class="app__form-submit-btn app__button-raised"
            type="submit"
          >
            {{ 'mass-invitation-form.submit-btn' | globalize }}
          </button>
        </div>
      </form>
    </template>

    <template v-else>
      <no-data-message
        class="mass-invitation-form__no-data-message"
        :title="'mass-invitation-form.no-assets-msg-title' | globalize"
        :message="'mass-invitation-form.no-assets-msg-description' | globalize"
      />
    </template>
  </div>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import IdentityGetterMixin from '@/vue/mixins/identity-getter'
import NoDataMessage from '@/vue/common/NoDataMessage'
import { required } from '@validators'

import { CsvUtil } from '@/js/utils/csv.util'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { Bus } from '@/js/helpers/event-bus'

import { mapGetters, mapActions } from 'vuex'
import { store, vuexTypes } from '@/vuex'

import { api } from '@/api'
import { base } from '@tokend/js-sdk'

const EVENTS = {
  submitted: 'submitted',
}

export default {
  name: 'mass-invitation-form',

  components: { NoDataMessage },

  mixins: [FormMixin, IdentityGetterMixin],

  props: {
    assetCode: { type: String, default: '' },
    invitees: { type: String, default: '' },
    amount: { type: [String, Number], default: '' },
  },

  data () {
    return {
      form: {
        assetCode: this.assetCode ||
          store.getters[vuexTypes.ownedAssets][0].code ||
          '',
        invitees: this.invitees || '',
        amount: String(this.amount) || '',
      },
    }
  },

  validations () {
    return {
      form: {
        assetCode: {
          required,
        },
        invitees: {
          required,
        },
      },
    }
  },

  computed: {
    ...mapGetters({
      ownedAssets: vuexTypes.ownedAssets,
      assetByCode: vuexTypes.assetByCode,
    }),
  },

  methods: {
    ...mapActions({
      loadAssets: vuexTypes.LOAD_ASSETS,
    }),

    async submit () {
      this.disableForm()

      try {
        const operations = await this.buildOperationsToSubmit()

        if (!operations.length) {
          Bus.error('mass-invitation-form.no-invitees-found')
          return
        }

        await api.postOperations(...operations)

        await this.loadAssets()
        this.clearFieldsWithOverriding({ assetCode: this.form.assetCode })
        this.$emit(EVENTS.submitted)
        Bus.success('mass-invitation-form.issued-successful-notification')
      } catch (error) {
        ErrorHandler.process(error)
      }

      this.enableForm()
    },

    async buildOperationsToSubmit () {
      const emails =
        CsvUtil.parseConcat(this.form.invitees, { trim: true })

      const balanceIds =
        await this.getBalanceIdByEmailMass(emails, this.form.assetCode)

      const operations = balanceIds.map((balId, id) => base
        .CreateIssuanceRequestBuilder.createIssuanceRequest({
          receiver: balId,
          asset: this.form.assetCode,
          amount: String(this.form.amount),
          reference: new Date().toISOString() + id,
          creatorDetails: {},
        }))

      return operations
    },

    buildCreateIssuanceRequestOp (balanceId) {
      return base.CreateIssuanceRequestBuilder.createIssuanceRequest({
        receiver: balanceId,
        asset: this.form.assetCode,
        amount: String(this.form.amount),
        reference: new Date().toISOString(),
        creatorDetails: {},
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import './app-form';
@import '@/scss/variables';

p.mass-invitation-form__how-to-invitees {
  line-height: 1.5;
  font-size: 1.6rem;
  margin-bottom: 2.4rem;
}
</style>
