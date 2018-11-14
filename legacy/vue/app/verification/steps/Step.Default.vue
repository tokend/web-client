<template>
  <form
    class="step"
    novalidate
    @submit.prevent="submit">
    <template v-for="(row, r) in schema.rows">
      <div
        class="app__form-row"
        :key="`verification-step-default-row-${r}`">
        <div
          class="app__form-field"
          v-for="(item, i) in row"
          :key="i">
          <h3 v-if="item.heading">{{ item.heading }}</h3>

          <p v-if="item.subheading">{{ item.subheading }}</p>

          <input-field-unchained
            v-if="item.field === 'text'"
            v-model="form[item.model]"
            v-validate="item.validate"
            class="step__input-field"
            :name="item.name"
            :id="item.id"
            :required="item.required"
            :label="item.label"
            :type="item.type"
            :key="item.id"
            :error-message="errorMessage(item.name)"
            :disabled="accountState === ACCOUNT_STATES.pending"
          />
          <textarea-field
            v-if="item.field === 'textarea'"
            v-model="form[item.model]"
            v-validate="item.validate"
            class="step__input-field"
            :name="item.name"
            :id="item.id"
            :required="item.required"
            :label="item.label"
            :type="item.type"
            :key="item.id"
            :maxlength="item.maxlength"
            :error-message="errorMessage(item.name)"
            :disabled="accountState === ACCOUNT_STATES.pending"
          />
          <file-field
            v-if="item.field === 'file'"
            v-model="documents[item.type]"
            class="step__file-field"
            :file-type="item.fileType"
            :private="item.private"
            :label="item.label"
            :type="item.type"
            :id="item.id"
            :key="item.id"
            :disabled="accountState === ACCOUNT_STATES.pending"
          />

          <select-field-unchained
            v-if="item.field === 'select' && values[item.values].length"
            :name="item.name"
            :id="item.id"
            :label="item.label"
            v-model="form[item.model]"
            :values="values[item.values]"
            :key="item.id"
            :disabled="accountState === ACCOUNT_STATES.pending" />

          <date-field-flatpickr
            v-if="item.field === 'date'"
            v-model="form[item.model]"
            v-validate="'required'"
            :name="item.name"
            :id="item.id"
            :required="item.required"
            :label="item.label"
            :disable-after="item.disableAfter"
            :disable-before="item.disableBefore"
            :key="item.id"
            :error-message="errorMessage(item.name)"
            :disabled="accountState === ACCOUNT_STATES.pending"
            :enable-time="item.enableTime"
          />
        </div>
      </div>
    </template>
    <div class="app__form-actions">
      <button
        v-ripple
        class="app__form-submit-btn"
        :disabled="isPending ||
        accountState === ACCOUNT_STATES.pending || isRequestPending"
        v-if="finished">
        {{ i18n.lbl_submit() }}
      </button>
      <button
        class="app__form-submit-btn"
        :disabled="isPending"
        v-else>
        {{ i18n.sale_next_step() }}
      </button>
    </div>
  </form>
</template>

<script>
import StepMixin from '../spec/step.mixin'
import _pick from 'lodash/pick'
import { ErrorHandler } from 'L@/js/errors/error_handler'
import { commonEvents } from 'L@/js/events/common_events'
import { ACCOUNT_STATES } from 'L@/js/const/const'
import { mapGetters } from 'vuex'
import { vuexTypes } from 'L@/vuex/types'
export default {
  name: 'step-default',
  mixins: [ StepMixin ],
  props: {
    schema: { type: Object, default: () => {} }
  },
  data: _ => ({
    finished: false,
    ACCOUNT_STATES
  }),
  computed: {
    ...mapGetters([
      vuexTypes.accountKycData,
      vuexTypes.accountKycDocuments,
      vuexTypes.accountState
    ])
  },
  watch: {
    kyc: {
      handler: 'stubData',
      immediate: true
    },
    activeStep (value) {
      this.finished = (value === this.finalStep)
    }
  },
  created () {
    this.finished = (this.activeStep === this.finalStep)
  },
  methods: {
    async submit () {
      if (!await this.isValid()) return
      this.disable()
      try {
        await this.uploadDocuments()
        this.enable()
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
      if (this.schema) {
        this.form = _pick(this.kyc, Object.keys(this.schema.form))
        delete this.form.docs
        this.documents = this.accountKycDocuments
      }
    }
  }
}
</script>

<style scoped>
  /* @import './step.scss'; */
</style>
