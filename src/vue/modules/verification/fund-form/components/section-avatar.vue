<template>
  <div class="verification-fund-form__section">
    <p class="verification-fund-form__section-label">
      {{ 'fund-form.avatar-lbl' | globalize }}
    </p>

    <div class="app__form-row">
      <div class="app__form-field">
        <file-field
          v-model="avatar"
          name="verification-fund-avatar"
          :note="'fund-form.image-type-note' | globalize"
          :file-extensions="['jpg', 'png']"
          :document-type="DOCUMENT_TYPES.kycAvatar"
          :label="'fund-form.avatar-lbl' | globalize"
          :disabled="isDisabled"
        />
      </div>
    </div>
  </div>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import SectionMixin from './section.mixin'

import { DOCUMENT_TYPES } from '@/js/const/document-types.const'

import { mapMutations } from 'vuex'
import { types } from '../store/types'

export default {
  name: 'section-avatar',
  mixins: [FormMixin, SectionMixin],
  data: _ => ({
    DOCUMENT_TYPES,
  }),
  computed: {
    avatar: {
      get () { return this.callGetter(types.avatar) },
      set (v) { this.setAvatar(v) },
    },
  },
  methods: {
    ...mapMutations('verification-fund-form', {
      setAvatar: types.SET_AVATAR,
    }),
  },
}
</script>

<style lang="scss" scoped>
  @import '../scss/styles';
</style>
