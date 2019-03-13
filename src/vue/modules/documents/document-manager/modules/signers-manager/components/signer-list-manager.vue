<template>
  <div class="signer-list-manager">
    <div class="signer-list-manager__header">
      <h2>{{ 'document-signers-manager.signer-list-title' | globalize }}</h2>
      <button
        class="app__button-raised"
        v-if="signerWhoManages.isAllowedToManageSigners"
        @click="openAddForm"
      >
        {{ 'document-signers-manager.add-new-signer-lbl' | globalize }}
      </button>
    </div>
    <div class="signer-list-manager__list">
      <template v-for="signer in signers">
        <signer-list-item
          :key="signer.publicKey"
          :signer-to-manage="signer"
          :signer-who-manages="signerWhoManages"
          @edit-click="selectSigner"
        />
      </template>
    </div>
    <drawer :is-shown.sync="isDrawerShown">
      <template slot="heading">
        <template v-if="selectedSigner">
          {{ 'document-signers-manager.manage-signer-title' | globalize }}
        </template>
        <template v-else>
          {{ 'document-signers-manager.add-signer-title' | globalize }}
        </template>
      </template>
      <manage-signer-form
        :signer-to-manage="selectedSigner"
        :signer-who-manages="signerWhoManages"
        :source-account-id="sourceAccountId"
      />
    </drawer>
  </div>
</template>

<script>
import ManageSignerForm from './manage-signer-form'
import SignerListItem from './signer-list-item'

import Drawer from '@/vue/common/Drawer'

import { Wallet } from '@tokend/js-sdk'

export default {
  name: 'signer-list-manager',
  components: {
    ManageSignerForm,
    SignerListItem,
    Drawer,
  },
  props: {
    signers: {
      type: Array, /** @link Signer **/
      required: true,
    },
    wallet: {
      type: Wallet,
      required: true,
    },
    sourceAccountId: {
      type: String,
      required: true,
    },
  },
  data: _ => ({
    isDrawerShown: false,
    selectedSigner: null,
  }),
  computed: {
    // TODO: rename
    signerWhoManages () {
      return this.signers.find(s => s.publicKey === this.wallet.accountId)
    },
  },
  methods: {
    openAddForm () {
      this.selectedSigner = null
      this.isDrawerShown = true
    },
    selectSigner (signer) {
      this.selectedSigner = signer
      this.isDrawerShown = true
    },
  },
}
</script>

<style lang="scss" scoped>
.signer-list-manager__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 3rem;
}
</style>
