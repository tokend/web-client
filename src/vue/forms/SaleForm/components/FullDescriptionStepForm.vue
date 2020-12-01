<template>
  <form
    class="app__form full-description-step-form"
    @submit.prevent="setConfirmationState"
  >
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          white-autofill
          v-model="form.youtubeVideo"
          name="create-sale-youtube-id"
          :label="'create-sale-form.youtube-video-lbl' | globalize"
          :disabled="formMixin.isDisabled"
        />
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <iframe
          v-if="form.youtubeVideo"
          :src="`https://www.youtube.com/embed/${youtubeId}`"
          class="full-description-step-form__iframe" />

        <div
          v-else
          class="full-description-step-form__youtube-video">
          <i class="mdi mdi-youtube full-description-step-form__video-icon" />
          <span>
            {{ 'create-sale-form.preview-video-msg' | globalize }}
          </span>
        </div>
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <span>
          {{ 'create-sale-form.full-description-lbl' | globalize }}
        </span>
        <markdown-field
          v-model="form.description"
          @blur="touchField('form.description')"
          :error-message="getFieldErrorMessage(
            'form.description',
            { length: DESCRIPTION_MAX_LENGTH }
          )"
        />
      </div>
    </div>

    <div class="app__form-actions">
      <form-confirmation
        v-if="formMixin.isConfirmationShown"
        @ok="hideConfirmation() || submit()"
        @cancel="hideConfirmation() || emitEnabledState()"
      />

      <button
        v-else
        v-ripple
        type="submit"
        class="app__button-raised full-description-step-form__btn"
        :disabled="isDisabled"
      >
        <template v-if="request">
          {{ 'create-sale-form.update-request-btn' | globalize }}
        </template>

        <template v-else>
          {{ 'create-sale-form.create-request-btn' | globalize }}
        </template>
      </button>
    </div>
  </form>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'

import { CreateSaleRequest } from '@/vue/modules/requests/create-sale-requests/wrappers/create-sale-request'
import { SaleFormer } from '@/js/formers/SaleFormer'
import { api } from '@/api'

import {
  maxLength,
} from '@validators'

const DESCRIPTION_MAX_LENGTH = 8000
const EVENTS = {
  submit: 'submit',
  updateIsDisabled: 'update:isDisabled',
}

export default {
  name: 'full-description-step-form',
  mixins: [FormMixin],
  props: {
    request: { type: CreateSaleRequest, default: null },
    isDisabled: { type: Boolean, default: false },
    former: { type: SaleFormer, required: true },
  },

  data () {
    return {
      form: {
        youtubeVideo: this.former.attrs.youtubeVideo || '',
        description: this.former.attrs.description || '',
      },
      DESCRIPTION_MAX_LENGTH,
    }
  },

  computed: {
    youtubeId () {
      const inputtedValue = this.form.youtubeVideo
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|v=)([^#]*).*/
      const match = inputtedValue.match(regExp)
      return match ? match[2] : inputtedValue
    },
  },

  async created () {
    if (this.request) {
      this.form.youtubeVideo = this.former.attrs.youtubeVideo
      this.form.description = await this.getSaleDescription(
        this.request.description,
        this.accountId
      )
      this.former.setAttr('description', this.form.description)
    }
  },

  validations () {
    return {
      form: {
        description: {
          maxLength: maxLength(DESCRIPTION_MAX_LENGTH),
        },
      },
    }
  },

  methods: {
    async getSaleDescription (blobId, accountId) {
      try {
        const endpoint = `/accounts/${accountId}/blobs/${blobId}`
        const { data: blob } = await api.getWithSignature(endpoint)

        return JSON.parse(blob.value)
      } catch {
        return ''
      }
    },

    submit () {
      this.former.mergeAttrs({
        youtubeVideo: this.form.youtubeVideo,
        description: this.form.description,
      })
      this.$emit(EVENTS.submit, this.former.attrs)
    },

    setConfirmationState () {
      this.showConfirmation()
      this.emitDisabledState()
    },

    emitDisabledState () {
      this.$emit(EVENTS.updateIsDisabled, true)
    },

    emitEnabledState () {
      this.$emit(EVENTS.updateIsDisabled, false)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/vue/forms/_app-form';
@import '~@scss/variables';

.full-description-step-form__btn {
  max-width: 14.4rem;
  width: 100%;
}

.full-description-step-form__youtube-video {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 26.4rem;
  border: 0.2rem dashed $col-border;
  border-radius: 0.4rem;
  opacity: 0.5;
}

.full-description-step-form__iframe {
  width: 100%;
  min-height: 26rem;
}

.full-description-step-form__video-icon {
  display: flex;
  font-size: 9rem;
}
</style>
