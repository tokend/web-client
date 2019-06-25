<template>
  <div class="mass-issuance-form">
    <template v-if="ownedAssets.length">
      <form @submit.prevent="isFormValid() && showConfirmation()">
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
              rows="6"
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
                {{ asset.nameAndCode }}
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
          <form-confirmation
            v-if="formMixin.isConfirmationShown"
            @cancel="hideConfirmation"
            @ok="submit"
          />

          <button
            v-else
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

import { ErrorHandler } from '@/js/helpers/error-handler'
// import { CsvUtil } from '@/js/utils/csv.util'

import { mapGetters } from 'vuex'
import { store, vuexTypes } from '@/vuex'

export default {
  name: 'mass-issuance-form',

  components: { NoDataMessage },

  mixins: [FormMixin, IdentityGetterMixin],

  props: {},

  data () {
    return {
      form: {
        assetCode: store.getters[vuexTypes.ownedAssets][0].code || '',
        receivers: '',
        amount: '',
      },
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

  methods: {
    async submit () {
      try {
        // TODO
        // const parsed = CsvUtil.parse(this.form.receivers)[0]
        // console.log(parsed)
        // console.log(await this.getAccountIdByEmailMass())
      } catch (error) {
        ErrorHandler.process(error)
      }
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
