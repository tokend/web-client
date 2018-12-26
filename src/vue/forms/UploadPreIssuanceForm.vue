<template>
  <form
    class="app-form issuance-form"
    @submit.prevent="submit"
  >
    <div class="app__form-row">
      <div class="app__form-field">
        <file-field
          :label="'issuance.lbl-pre-issuance' | globalize"
          :note="'issuance.lbl-file-type' | globalize"
        />
      </div>
    </div>
    <div class="app__form-actions">
      <button
        v-ripple
        type="submit"
        class="issuance-form__submit-btn"
        :disabled="formMixin.isDisabled"
      >
        {{ 'issuance.next' | globalize }}
      </button>
      <button
        v-ripple
        type="button"
        class="issuance-form__cancel-btn"
        :disabled="formMixin.isDisabled"
        @click.prevent="cancel"
      >
        {{ 'issuance.cancel' | globalize }}
      </button>
    </div>
  </form>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import FileField from '@/vue/fields/FileField'

import { vuexTypes } from '@/vuex'
import { mapGetters } from 'vuex'

export default {
  name: 'create-issuance-form',
  components: {
    FileField
  },
  mixins: [FormMixin],
  props: {
    isShown: { type: Boolean, default: true }
  },
  computed: {
    ...mapGetters([
      vuexTypes.wallet
    ])
  },
  methods: {
    async submit () {
      return this.isFormValid()
      // const operation =
      //   base.CreateIssuanceRequestBuilder.createIssuanceRequest({
      //     asset: this.form.asset,
      //     amount: this.form.amount.toString(),
      //     receiver:
      //       'BBKVOTHCUDI4X5MFYNQN7YEAJYY7OPS3HO7J3BBESPQCV23MXW7LLMKR',
      //     reference: this.form.reference,
      //     externalDetails: {}
      //   })
      // await Sdk.horizon.transactions.submitOperations(operation)
    },
    cancel () {
      this.$emit('update:isShown', false)
    }
  }
}
</script>

<style lang="scss" scoped>
@import './app-form';
@import './issuance-form';
</style>
