<template>
  <div class="verification-general-form__section">
    <p class="verification-general-form__section-label">
      {{ 'general-form.avatar-lbl' | globalize }}
    </p>

    <div class="app__form-row">
      <div class="app__form-field">
        <file-field
          v-model="avatar"
          name="verification-general-avatar"
          :note="'general-form.image-type-note' | globalize"
          accept="image/*"
          :document-type="DOCUMENT_TYPES.kycAvatar"
          :label="'general-form.avatar-lbl' | globalize"
          :disabled="formMixin.isDisabled"
        />
      </div>
    </div>
  </div>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'

import { DOCUMENT_TYPES } from '@/js/const/document-types.const'

import { mapState, mapMutations } from 'vuex'
import { types } from '../store/types'

export default {
  name: 'section-avatar',
  mixins: [FormMixin],
  data: _ => ({
    DOCUMENT_TYPES,
  }),
  computed: {
    ...mapState('verification-general-form', {
      form: state => state.form,
    }),
    avatar: {
      get () { return this.form.documents.avatar },
      set (v) { this.setAvatar(v) },
    },
  },
  methods: {
    ...mapMutations('verification-general-form', {
      setAvatar: types.SET_AVATAR,
    }),
  },
}
</script>

<style lang="scss" scoped>
  @import '../scss/styles';
</style>
