<template>
  <div class="manage-signer-form">
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          name="signer-email"
          v-model="form.email"
          :label="'document-signers-manager.signer-email-lbl' | globalize"
          :error-message="getFieldErrorMessage('form.email')"
          :disabled="formMixin.isDisabled || isUpdateMode"
          @blur="touchField('form.email')"
        />
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <tick-field v-model="form.isAllowedToUpdateMetadata">
          <!--eslint-disable-next-line-->
          {{ 'document-signers-manager.can-update-meta-msg' | globalize }}
        </tick-field>
      </div>
    </div>
    <div class="app__form-row">
      <div class="app__form-field">
        <tick-field v-model="form.isAllowedToManageSigners">
          <!--eslint-disable-next-line-->
          {{ 'document-signers-manager.can-manage-signers-msg' | globalize }}
        </tick-field>
      </div>
    </div>

    <div class="app__form-actions">
      <template v-if="isUpdateMode">
        <button
          class="app__button-raised"
          :disabled="formMixin.isDisabled"
          @click="updateSigner"
        >
          {{ 'document-manager.update-signer-btn' | globalize }}
        </button>
        <button
          class="app__button-raised app__button-raised--danger"
          :disabled="formMixin.isDisabled"
          @click="deleteSigner"
        >
          {{ 'document-manager.delete-signer-btn' | globalize }}
        </button>
      </template>
      <template v-else>
        <button
          class="app__button-raised"
          :disabled="formMixin.isDisabled"
          @click="addSigner"
        >
          {{ 'document-manager.add-signer-btn' | globalize }}
        </button>
      </template>
    </div>
  </div>
</template>

<script>
import TickField from '@/vue/fields/TickField'
import FormMixin from '@/vue/mixins/form.mixin'
import IdentityGetterMixin from '@/vue/mixins/identity-getter'

import { ErrorHandler } from '@/js/helpers/error-handler'
import { Bus as GlobalBus } from '@/js/helpers/event-bus'
import { Bus as LocalBus } from '../event-bus'

import { base } from '@tokend/js-sdk'
import { api } from '@/api'
import { required, email } from '@validators'

import { Signer } from '../wrappers/signer'

const ROLE_IDS = Object.freeze({
  isAllowedToManageSigners: '1',
  isAllowedToUpdateMetadata: '1',
  isAllowedAll: '1',
  isAllowedNothing: '1',
})

const DEFAULT_SIGNER_ATTRS = Object.freeze({
  weight: 1000,
  identity: 1,
})

export default {
  name: 'manage-signer-form',
  components: {
    TickField,
  },
  mixins: [FormMixin, IdentityGetterMixin],
  props: {
    signerToManage: {
      type: [Signer, null],
      default: null,
    },
    signerWhoManages: {
      type: Signer,
      required: true,
    },
    sourceAccountId: {
      type: String,
      required: true,
    },
  },
  data: _ => ({
    form: {
      email: '',
      isAllowedToManageSigners: false,
      isAllowedToUpdateMetadata: false,
    },
    isUpdateMode: false,
  }),
  validations: {
    form: {
      email: { required, email },
    },
  },
  computed: {
    roleIDToSet () {
      // TODO: bitmask may be easier
      if (
        this.form.isAllowedToUpdateMetadata &&
        this.form.isAllowedToManageSigners
      ) {
        return ROLE_IDS.isAllowedAll
      } else if (this.form.isAllowedToManageSigners) {
        return ROLE_IDS.isAllowedToManageSigners
      } else if (this.form.isAllowedToUpdateMetadata) {
        return ROLE_IDS.isAllowedToUpdateMetadata
      } else {
        return ROLE_IDS.isAllowedNothing
      }
    },
  },
  async created () {
    if (this.signerToManage !== null) {
      this.isUpdateMode = true
      await this.populateForm(this.signerToManage)
    }
  },
  methods: {
    async populateForm (signer) {
      this.form.email = await this.getEmailByAccountId(signer.publicKey)
      this.form.isAllowedToUpdateMetadata = signer.isAllowedToUpdateMetadata
      this.form.isAllowedToManageSigners = signer.isAllowedToManageSigners
    },
    async addSigner () {
      if (!this.isFormValid()) {
        return
      }

      this.disableForm()
      try {
        const publicKey = await this.getAccountIdByEmail(this.form.email)
        const operation = base.ManageSignerBuilder.createSigner({
          ...DEFAULT_SIGNER_ATTRS,
          publicKey,
          roleID: this.roleIDToSet,
          source: this.sourceAccountId,
          details: {
            isAllowedToManageSigners: this.form.isAllowedToManageSigners,
            isAllowedToUpdateMetadata: this.form.isAllowedToUpdateMetadata,
          },
        })
        await api().postOperations(operation)
        LocalBus.emitSignersUpdate()
        GlobalBus.success('document-manager.signer-added-msg')
        this.$emit('close')
      } catch (e) {
        ErrorHandler.process(e)
      }
      this.enableForm()
    },
    async updateSigner () {
      this.disableForm()
      try {
        const operation = base.ManageSignerBuilder.updateSigner({
          ...DEFAULT_SIGNER_ATTRS,
          roleID: '2', // this.roleIDToSet,
          publicKey: this.signerToManage.publicKey,
          source: this.sourceAccountId,
          details: {
            isAllowedToManageSigners: this.form.isAllowedToManageSigners,
            isAllowedToUpdateMetadata: this.form.isAllowedToUpdateMetadata,
          },
        })
        await api().postOperations(operation)
        LocalBus.emitSignersUpdate()
        GlobalBus.success('document-manager.signer-updated-msg')
        this.$emit('close')
      } catch (e) {
        ErrorHandler.process(e)
      }
      this.enableForm()
    },
    async deleteSigner () {
      this.disableForm()
      try {
        const operation = base.ManageSignerBuilder.deleteSigner({
          publicKey: this.signerToManage.publicKey,
          source: this.sourceAccountId,
        })
        await api().postOperations(operation)
        LocalBus.emitSignersUpdate()
        GlobalBus.success('document-manager.signer-deleted-msg')
        this.$emit('close')
      } catch (e) {
        ErrorHandler.process(e)
      }
      this.enableForm()
    },
  },
}
</script>

<style lang="scss" scoped>
@import "~@/vue/forms/_app-form";
</style>
