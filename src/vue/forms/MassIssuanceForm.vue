<template>
  <div class="mass-issuance-form">
    <template v-if="isLoading && ownedAssets.length">
      <form @submit.prevent="submit()">
        <div class="app__form-row">
          <div class="app__form-field">
            <p class="mass-issuance-form__how-to-receivers">
              {{ 'mass-issuance-form.how-to-receivers-paragraph' | globalize }}
            </p>

            <textarea-field
              name="mass-issuance-receivers"
              v-model="form.receivers"
              :label="'mass-issuance-form.receivers-lbl' | globalize"
              :disabled="formMixin.isDisabled"
              @blur="touchField('form.receivers')"
              :error-message="getFieldErrorMessage('form.receivers')"
              rows="8"
            />
          </div>
        </div>

        <div class="app__form-row">
          <div class="app__form-field">
            <select-field
              name="mass-issuance-asset-code"
              v-model="form.assetCode"
              :label="'mass-issuance-form.asset-lbl' | globalize"
              @blur="touchField('form.assetCode')"
              :error-message="getFieldErrorMessage('form.assetCode')"
              :disabled="formMixin.isDisabled"
            >
              <option
                v-for="asset in ownedAssets"
                :key="asset.code"
                :value="asset.code"
              >
                {{ asset.name }}
              </option>
            </select-field>

            <template v-if="form.assetCode">
              <p class="app__form-field-description">
                {{
                  'mass-issuance-form.available-for-issuance-hint' | globalize({
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
              name="mass-issuance-amount"
              validation-type="issuance"
              :label="'mass-issuance-form.amount-lbl' | globalize"
              :asset="assetByCode(form.assetCode)"
              :disabled="formMixin.isDisabled"
            />
          </div>
        </div>

        <div class="app__form-actions">
          <button
            v-ripple
            :disabled="formMixin.isDisabled"
            class="app__form-submit-btn app__button-raised"
            type="submit"
          >
            {{ 'mass-issuance-form.submit-btn' | globalize }}
          </button>
        </div>
      </form>
    </template>

    <template v-else>
      <no-data-message
        class="mass-issuance-form__no-data-message"
        :title="'mass-issuance-form.no-assets-msg-title' | globalize"
        :message="'mass-issuance-form.no-assets-msg-description' | globalize"
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
import { MathUtil } from '@/js/utils'

const EVENTS = {
  submitted: 'submitted',
}

export default {
  name: 'mass-issuance-form',

  components: { NoDataMessage },

  mixins: [FormMixin, IdentityGetterMixin],

  props: {
    assetCode: { type: String, default: '' },
    receivers: { type: String, default: '' },
    amount: { type: [String, Number], default: '' },
  },

  data () {
    return {
      form: {
        assetCode: this.assetCode ||
          store.getters[vuexTypes.ownedAssets][0].code ||
          '',
        receivers: this.receivers || '',
        amount: String(this.amount) || '',
      },
      isLoading: false,
    }
  },

  validations () {
    return {
      form: {
        assetCode: {
          required,
        },
        receivers: {
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

  async created () {
    await this.loadAssets()
    this.isLoading = true
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
          Bus.error('mass-issuance-form.no-receivers-found')
          return
        }

        // Core cannot handle more than 100 operations per transaction
        if (operations.length >= 100) {
          Bus.error('mass-issuance-form.too-much-op-error-notif')
          return
        }

        const isOverissue = MathUtil.compare(
          MathUtil.multiply(operations.length, this.form.amount),
          this.assetByCode(this.form.assetCode).availableForIssuance,
        ) > 0
        if (isOverissue) {
          Bus.error('mass-issuance-form.overissue-error-notif')
          return
        }

        await api.postOperations(...operations)

        await this.loadAssets()
        this.clearFieldsWithOverriding({
          receivers: this.form.receivers,
          assetCode: this.form.assetCode,
        })
        this.$emit(EVENTS.submitted)
        Bus.success('mass-issuance-form.issued-successfully-notification')
      } catch (error) {
        ErrorHandler.process(error)
      }

      this.enableForm()
    },

    async buildOperationsToSubmit () {
      const emails = CsvUtil.parseConcat(this.form.receivers, {
        trim: true,
        filterEmpty: true,
        delimiters: CsvUtil.delimiters.common,
      })

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

p.mass-issuance-form__how-to-receivers {
  line-height: 1.5;
  font-size: 1.6rem;
  margin-bottom: 2.4rem;
}
</style>
