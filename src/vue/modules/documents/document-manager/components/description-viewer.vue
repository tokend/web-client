<template>
  <div class="description-viewer">
    <template v-if="isUpdateMode">
      <markdown-field
        v-model="form.description"
        :disabled="formMixin.isDisabled"
        :error-message="getFieldErrorMessage('form.description')"
      />
      <div class="app__form-actions app__form-actions--right">
        <button
          class="app__button"
          :disabled="formMixin.isDisabled"
          @click="unsetUpdateMode"
        >
          {{ 'document-manager.cancel-update-description-lbl' | globalize }}
        </button>
        <button
          class="app__button-raised"
          :disabled="formMixin.isDisabled"
          @click="updateDescription"
        >
          {{ 'document-manager.update-description-lbl' | globalize }}
        </button>
      </div>
    </template>
    <template v-else>
      <button
        v-if="signer.isAllowedToUpdateMetadata"
        @click="setUpdateMode"
        :disabled="formMixin.isDisabled"
      >
        {{ 'document-manager.edit-description-lbl' | globalize }}
        <i class="mdi mdi-pencil" />
      </button>
      <vue-markdown
        :source="descriptionToShow"
        @dblclick.native="setUpdateMode"
      />
    </template>
  </div>
</template>

<script>
import VueMarkdown from 'vue-markdown'
import MarkdownField from '@/vue/fields/MarkdownField'
import FormMixin from '@/vue/mixins/form.mixin'

import { Metadata } from '../wrappers/metadata'
import { Signer } from '../wrappers/signer'

import { ErrorHandler } from '@/js/helpers/error-handler'

import { base } from '@tokend/js-sdk'
import { api } from '../_api'
import { required } from '@validators'

const CHANGE_ROLE_REQUEST_ID = '0'
const ACCOUNT_ROLE_TO_SET = '2'
const BLOB_TYPE = 'kyc_form'

export default {
  name: 'description-viewer',
  components: {
    VueMarkdown,
    MarkdownField,
  },
  mixins: [FormMixin],
  props: {
    signer: {
      type: Signer,
      required: true,
    },
    documentAccountId: {
      type: String,
      required: true,
    },
    metadata: {
      type: Metadata,
      required: true,
    },
  },
  data: _ => ({
    form: {
      description: '',
    },
    descriptionToShow: '',
    isUpdateMode: false,
  }),
  validations: {
    form: {
      description: { required },
    },
  },
  created () {
    this.descriptionToShow = this.metadata.description
  },
  methods: {
    setUpdateMode () {
      if (!this.signer.isAllowedToUpdateMetadata) {
        return
      }
      this.form.description = this.descriptionToShow
      this.isUpdateMode = true
    },
    unsetUpdateMode () {
      this.form.description = this.descriptionToShow
      this.isUpdateMode = false
    },
    async updateDescription () {
      this.disableForm()
      try {
        const blobId = await this.createBlob()
        await this.createChangeRoleRequest(blobId)
        this.descriptionToShow = this.form.description
        this.unsetUpdateMode()
      } catch (e) {
        ErrorHandler.process(e)
      }
      this.enableForm()
    },
    async createChangeRoleRequest (blobId) {
      const operation = base.CreateChangeRoleRequestBuilder
        .createChangeRoleRequest({
          requestID: CHANGE_ROLE_REQUEST_ID,
          destinationAccount: this.documentAccountId,
          accountRoleToSet: ACCOUNT_ROLE_TO_SET,
          creatorDetails: {
            blob_id: blobId,
          },
        })

      await api().postOperations(operation)
    },

    async createBlob () {
      const details = {
        file: {
          key: this.metadata.fileKey,
          hash: this.metadata.fileHash,
          name: this.metadata.fileName,
          mime_type: this.metadata.fileMimeType,
        },
        description: this.form.description,
      }

      const { data } = await api().postWithSignature('/blobs', {
        data: {
          type: BLOB_TYPE,
          attributes: {
            value: JSON.stringify(details),
          },
          relationships: {
            owner: {
              data: { id: this.documentAccountId },
            },
          },
        },
      })

      return data.id
    },
  },
}
</script>

<style lang="scss">
@import '~@/vue/forms/_app-form';

.description-viewer {
  text-align: justify;

  h1 { margin: 3rem 0 }
  h2 { margin: 2rem 0 }
  h3 { margin: 1.5rem 0 }
  h4 { margin: 1.25rem 0 }
  h5 { margin: 1.15rem 0 }
  h6 { margin: 1.10rem 0 }

  p { margin: 1rem 0 }
}
</style>
