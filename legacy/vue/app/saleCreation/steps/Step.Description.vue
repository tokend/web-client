<template>
  <form
    class="step"
    @submit.prevent="submit">
    <div class="app__form-row">
      <div
        class="video-container"
        :class="{ 'video-container--empty': !form.youtubeId }">
        <div v-if="!form.youtubeId">
          <p>Insert YouTube video by its ID</p>
          <button
            @click="uploadVideo = true"
            type="button"
            class="app__button-raised">
            Enter ID
          </button>
        </div>
        <md-dialog-prompt
          :md-active.sync="uploadVideo"
          v-model="form.youtubeId"
          md-title="You can find YouTube video ID in its URL"
          md-input-maxlength="30"
          md-input-placeholder="Type your YouTube video ID..."
          md-confirm-text="Done" />

        <div
          class="video-container__iframe-wrapper"
          v-show="form.youtubeId">
          <iframe
            :src="`https://www.youtube.com/embed/${form.youtubeId}`"
            class="video-container__iframe" />
          <a @click="uploadVideo = true">Insert another YouTube video</a>
        </div>
      </div>
    </div>
    <div class="app__form-row">
      <description-editor
        class="description-step__editor"
        v-model="form.description" />
    </div>
    <div class="app__form-actions">
      <button
        v-ripple
        type="submit"
        class="app__form-submit-btn">
        {{ i18n.sale_create_sale() }}
      </button>
    </div>
  </form>
</template>

<script>
import StepMixin from './step.mixin'
import DescriptionEditor from '../components/DescriptionEditor'
import { documentTypes, blobTypes } from '../../../../js/const/const'
import { i18n } from '../../../../js/i18n/index'

import { commonEvents } from '../../../../js/events/common_events'
import { ErrorHandler } from '../../../../js/errors/error_handler'
import { usersService } from '../../../../js/services/users.service'
import { mapGetters } from 'vuex'
import { vuexTypes } from '../../../../vuex/types'

import _pick from 'lodash/pick'
export default {
  name: 'step-create-sale',
  components: {
    DescriptionEditor
  },
  mixins: [StepMixin],
  data: _ => ({
    form: {
      description: '',
      descriptionID: '',
      youtubeId: ''
    },
    i18n,
    documentTypes,
    uploadVideo: false
  }),
  computed: {
    ...mapGetters([
      vuexTypes.userAccountId
    ])
  },
  created () {
    this.form = _pick(this.sale, Object.keys(this.form))
    this._loadDescriptionIfExists()
  },
  methods: {
    async submit () {
      if (!await this.isValid()) return
      this.disable()
      try {
        const descriptionId = (await usersService
          .blobsOf(this.userAccountId)
          .create(blobTypes.fundOverview.str,
            this.form.description, {}, false))
          .data('id')
        this.form.descriptionID = descriptionId
        this.$emit(commonEvents.saleUpdateEvent, {
          form: this.form,
          documents: this.documents
        })
        this.$emit(commonEvents.saleEditEndEvent)
      } catch (error) {
        ErrorHandler.processUnexpected(error)
      }
      this.enable()
    },

    async _loadDescriptionIfExists () {
      if (!this.form.descriptionID) return
      this.form.description =
        await usersService.blobsOf()
          .get(this.form.descriptionID)
    }
  }
}
</script>

<style scoped lang="scss">
  @import 'step';
  @import '~L@scss/mixins';
  @import '~L@scss/variables';

  .step-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .step-row--description {
    margin-top: 8px;
  }

  .video-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    border: 1px dashed transparent;
    border-radius: 4px;
    text-align: center;
    height: 300px;

    & button {
      margin-top: 24px;
    }

    @include respond-to(small) {
      height: 220px;
    }
  }

  .video-container--empty {
    border-color: $col-fund-video-border;
    padding: 20px;
  }

  .video-container__iframe-wrapper {
    width: 100%;
    text-align: left;
    margin-bottom: 24px;
    color: $col-fund-video-border;

    & a {
      margin-top: 8px;
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  .video-container__iframe {
    width: 100%;
    height: 300px;

    @include respond-to(small) {
      height: 220px;
    }
  }

  .step__action {
    margin-top: 1rem;
  }

</style>
