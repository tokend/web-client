<template>
  <form
    class="step"
    @submit.prevent="submit">
    <p class="app__page-explanations kyc-form__page-explanations">
      {{ i18n.kyc_photo_explain() }}
    </p>
    <span
      class="app__button-raised"
      @click="isDialogOpened = true">
      {{ i18n.kyc_show_key() }}
    </span>
    <div class="app__form-row">
      <file-field
        class="kyc-form__file-field"
        id="kyc-file-photo"
        v-model="documents[documentTypes.kycSelfie]"
        v-validate="'required'"
        :label="i18n.lbl_kyc_selfie()"
        :type="documentTypes.kycSelfie"
        :data-vv-as="i18n.lbl_kyc_selfie()"
      />
    </div>
    <div class="app__form-actions">
      <button
        class="app__form-submit-btn"
        :disabled="isPending ||
        isRequestPending || accountState === ACCOUNT_STATES.pending">
        {{ i18n.lbl_agree_submit() }}
      </button>
    </div>
    <md-dialog :md-active.sync="isDialogOpened">
      <md-dialog-title>
        {{ i18n.kyc_verification_key() }}
      </md-dialog-title>
      <div class="app__dialog__inner">
        <p class="kyc-form__verification-key">
          {{ verificationKey }}
        </p>
      </div>
      <md-dialog-actions class="md-layout md-alignment-center-right">
        <md-button
          class="md-primary"
          @click="isDialogOpened = false">
          {{ i18n.lbl_done() }}
        </md-button>
      </md-dialog-actions>
    </md-dialog>
  </form>
</template>

<script>
import StepMixin from '../../spec/step.mixin'
import FormMixin from 'L@/vue/common/mixins/form.mixin'
import {
  ASSET_POLICIES,
  ACCOUNT_STATES,
  documentTypes
} from 'L@/js/const/const'
import { commonEvents } from 'L@/js/events/common_events'
import { ErrorHandler } from 'L@/js/errors/error_handler'
import { i18n } from 'L@/js/i18n/index'
import _cloneDeep from 'lodash/cloneDeep'
import { vuexTypes } from 'L@/vuex/types'
import { mapGetters } from 'vuex'

export default {
  name: 'step-selfie',
  mixins: [StepMixin, FormMixin],
  data: _ => ({
    isDialogOpened: false,
    form: {},
    documents: {},
    i18n,
    documentTypes,
    ASSET_POLICIES,
    ACCOUNT_STATES
  }),

  computed: {
    ...mapGetters([
      vuexTypes.accountState,
      vuexTypes.accountId
    ]),
    verificationKey () {
      return this.accountId.slice(1, 6)
    }
  },
  watch: {
    kyc: {
      handler: 'stubData',
      immediate: true
    },
    activeStep (value) {
      if (value === this.finalStep) {
        this.stubData()
      }
    }
  },

  methods: {
    async submit () {
      if (!await this.isValid()) return
      this.disable()
      try {
        await this.uploadDocuments()
        this.$emit(commonEvents.kycUpdateEvent, {
          form: this.form,
          documents: this.documents
        })
      } catch (error) {
        this.enable()
        ErrorHandler.processUnexpected(error)
      }
    },
    stubData () {
      this.form = _cloneDeep(this.kyc)
      this.documents = _cloneDeep(this.kyc.documents)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '~L@scss/variables';

  .kyc-form__page-explanations.app__page-explanations {
    margin-top: 0 !important;
    margin-bottom: 1.5 * $point !important;
  }

  .kyc-form__verification-key {
    font-size: 2rem;
    font-weight: bold;
    margin: 2rem 0;
    text-align: center;
  }
</style>
