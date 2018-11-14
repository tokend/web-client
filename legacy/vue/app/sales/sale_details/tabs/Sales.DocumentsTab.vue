<template>
  <div class="documents-tab">
    <template v-if="isMy">
      <p class="documents-tab__explain">
        {{ i18n.sale_doc_tab_title_is_my() }}
      </p>
      <div class="documents-tab__file-input">
        <file-field
          v-model="upload"
          label="Select File(s)"
          id="documents-tab__file-field" />
      </div>
      <md-button
        class="documents-tab__file-submit"
        v-if="upload.file"
        @click="submit"
        :disabled="isPending">
        {{ i18n.lbl_submit() }}
      </md-button>
    </template>

    <template v-else-if="!documents.length && !isMy">
      <div class="no-data-msg__wrapper">
        <i class="no-data-msg__icon material-icons">search</i>
        <h2>{{ i18n.sale_doc_tab_docs_is_my() }}</h2>
      </div>
    </template>

    <div
      class="documents-tab__docs-list"
      v-if="documents.length">
      <template v-for="(document, d) in documents">
        <div
          class="documents-tab__file-download-wrp"
          :key="`sales-documents-tab-${d}`">
          <h3
            class="file-download__file-name"
            :title="document.name">
            {{ document.name }}
          </h3>
          <a
            :href="getUrl(document)"
            class="file-view__link"
            target="_blank"
            rel="noopener">
            <span>{{ i18n.fi_view_file() }}</span>
          </a>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import SubmitterMixin from 'L@/vue/common/mixins/submitter.mixin'
import FileField from 'L@/vue/common/fields/FileField'
import { i18n } from 'L@/js/i18n'

import { ErrorHandler } from 'L@/js/errors/error_handler'
import { EventDispatcher } from 'L@/js/events/event_dispatcher'
import { confirmAction } from 'L@/js/modals/confirmation_message'
import { blobTypes, blobFilters } from 'L@/js/const/const'
import { fileService } from 'L@/js/services/file.service'
import { usersService } from 'L@/js/services/users.service'
import { DocumentContainer } from 'L@/js/helpers/DocumentContainer'
import _get from 'lodash/get'
import { mapGetters } from 'vuex'
import { vuexTypes } from 'L@/vuex/types'

export default {
  components: {
    FileField
  },
  mixins: [SubmitterMixin],
  props: {
    sale: { type: Object, default: () => {} }
  },
  data: _ => ({
    i18n,
    documents: [],
    upload: {
      mimeType: '',
      file: '',
      name: ''
    }
  }),
  computed: {
    ...mapGetters([
      vuexTypes.accountId
    ]),
    isMy () {
      return this.sale.owner === this.accountId
    }
  },
  watch: {
    sale: {
      handler: 'getDocuments',
      immediate: true
    }
  },
  methods: {
    async submit () {
      if (!await confirmAction({
        title: i18n.sale_confirm_upload_ttl(),
        message: i18n.sale_confirm_upload()
      })) return
      const tokenCode = this.sale.baseAsset
      this.disable()
      try {
        const fileKey = await fileService.uploadFile({
          ...this.upload,
          type: blobTypes.fundDocument.str
        })
        await usersService.blobsOf(this.sale.owner).create(
          blobTypes.fundDocument.str,
          {
            type: this.upload.mimeType,
            name: this.upload.name,
            key: fileKey
          },
          { [blobFilters.tokenCode]: tokenCode }
        )
        EventDispatcher.dispatchShowSuccessEvent(i18n.sale_upload_success())
        await this.getDocuments()
        this.reset()
      } catch (error) {
        console.error(error)
        ErrorHandler.processUnexpected(error)
      }
      this.enable()
    },
    async getDocuments () {
      if (!_get(this.sale, 'baseAsset')) return
      this.documents = (await usersService
        .blobsOf(this.sale.owner)
        .getAll({
          [blobFilters.tokenCode]: this.sale.baseAsset,
          [blobFilters.type]: blobTypes.fundDocument.num
        }))
        .map(doc => new DocumentContainer(doc))
    },
    reset () {
      this.upload.file = ''
      this.upload.mimeType = ''
    },
    getUrl (file) {
      return file.publicUrl
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '~L@scss/variables';
  @import '~L@scss/mixins';
  .documents-tab {
    padding-top: 1rem;
  }

  .documents-tab__no-docs-message {
    text-align: center;

    i {
      font-size: $size-icon-super-big;
    }
  }

  .documents-tab__file-input {
    margin-top: 30px;
    text-align: center;
  }

  .documents-tab__explain {
    color: $col-text-accented;
    font-size: .8rem;
    text-align: center;
  }

  .documents-tab__docs-list {
    margin: 40px auto;
    display: flex;
    flex-wrap: wrap;
    width: 100%;
  }

  .documents-tab__file-download-wrp {
    display: flex;
    flex-direction: column;
    margin-bottom: 1.5rem;
    width: 50%;
  }

  .file-download {
    display: flex;
    flex-direction: column;
  }

  .file-view__link {
    color: $col-text-accented;
    cursor: pointer;
    display: flex;
    font-size: .8rem;
    text-decoration: underline;
    i {
      font-size: .8rem;
      color: $col-text-accented;
      margin-left: 5px;
    }
  }

  .file-download__file-name {
    max-width: 180px;
    overflow: hidden;
    margin-right: 0.5rem;
    text-overflow: ellipsis;
  }

  .no-data-msg__wrapper {
    display: flex;
    flex-direction: column;
    text-align: center;
    color: $col-no-data-message-text;

    & > h2 {
      font-weight: 500;
    }
  }

  .no-data-msg__icon {
    font-size: $size-icon-super-big;
    color: $col-no-data-message-icon-color;
  }
</style>
