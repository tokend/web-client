<template>
  <div class="add-comment-form">
    <template v-if="isExpanded">
      <markdown-field
        v-model="form.description"
        :disabled="formMixin.isDisabled"
        :error-message="getFieldErrorMessage('form.description')"
      />
      <div class="add-comment-form__actions">
        <button
          @click="isExpanded = false"
          class="app__button"
          :disabled="formMixin.isDisabled"
        >
          {{ 'document-manager.cancel-lbl' | globalize }}
        </button>
        <button
          @click="submit"
          class="app__button-raised"
          :disabled="formMixin.isDisabled"
        >
          {{ 'document-manager.submit-lbl' | globalize }}
        </button>
      </div>
    </template>
    <template v-else>
      <button @click="isExpanded = true">
        {{ 'document-manager.add-comment-lbl' | globalize }}
        <i class="mdi mdi-pencil" />
      </button>
    </template>
  </div>
</template>

<script>
import MarkdownField from '@/vue/fields/MarkdownField'

import FormMixin from '@/vue/mixins/form.mixin'

import { ErrorHandler } from '@/js/helpers/error-handler'

import { base } from '@tokend/js-sdk'
import { api } from '@/api'
import { required } from '@validators'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

import { Metadata } from '../wrappers/metadata'

// import { handleClickOutside } from '@/js/helpers/handle-click-outside'

const CHANGE_ROLE_REQUEST_ID = '0'
const ACCOUNT_ROLE_TO_SET = '2'
const BLOB_TYPE = 'kyc_form'

export default {
  name: 'add-comment-form',
  components: {
    MarkdownField,
  },
  mixins: [FormMixin],
  props: {
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
    isExpanded: false,
  }),
  validations: {
    form: {
      description: { required },
    },
  },
  computed: {
    ...mapGetters([
      vuexTypes.accountId,
    ]),
  },
  methods: {
    expand () {
      this.isExpanded = true
      // handleClickOutside('#add-comment-form-md-editor', () => {
      //   this.isExpanded = false
      // })
    },
    async submit () {
      this.disableForm()
      try {
        const blobId = await this.createBlob()
        await this.createChangeRoleRequest(blobId)
        this.$emit('comment-add')
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
        uploader_account_id: this.metadata.uploaderAccountId,
        updater_account_id: this.accountId,
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

<style lang="scss" scoped>
@import '~@/vue/forms/_app-form';

.add-comment-form__actions {
  margin-top: 1.5rem;
  display: flex;
  justify-content: flex-end;
}
</style>
