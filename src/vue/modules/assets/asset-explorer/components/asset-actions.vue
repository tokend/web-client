<template>
  <div class="asset-actions">
    <button
      v-ripple
      class="app__button-raised asset-actions__btn"
      @click="isTransferDrawerShown = true"
    >
      {{ 'assets.send-btn' | globalize }}
    </button>

    <button
      v-if="isAssetOwner"
      v-ripple
      class="app__button-raised asset-actions__btn"
      @click="$emit(EVENTS.updateAsset)"
    >
      {{ 'assets.update-btn' | globalize }}
    </button>

    <button
      v-if="isAssetOwner"
      v-ripple
      class="app__button-raised asset-actions__btn"
      @click="deleteAsset"
    >
      {{ 'assets.delete-btn' | globalize }}
    </button>

    <drawer :is-shown.sync="isTransferDrawerShown">
      <template slot="heading">
        {{ 'transfer-form.form-heading' | globalize }}
      </template>
      <transfer-form
        @operation-submitted="(isTransferDrawerShown = false) ||
          $emit(EVENTS.assetTransfered)
        "
        :asset-to-transfer="asset.code"
      />
    </drawer>
  </div>
</template>

<script>
import { AssetRecord } from '@/js/records/entities/asset.record'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

import TransferForm from '@/vue/forms/TransferForm'
import Drawer from '@/vue/common/Drawer'
import { api } from '@/api'
import { base } from '@tokend/js-sdk'

import { ErrorHandler } from '@/js/helpers/error-handler'

const EVENTS = {
  assetTransfered: 'asset-transfered',
  updateAsset: 'update-asset',
}

export default {
  name: 'asset-actions',

  components: {
    TransferForm,
    Drawer,
  },
  props: {
    asset: { type: AssetRecord, required: true },
  },
  data: _ => ({
    isTransferDrawerShown: false,
    isPending: false,
    EVENTS,
  }),

  computed: {
    ...mapGetters({
      accountId: vuexTypes.accountId,
    }),

    isAssetOwner () {
      return this.asset.owner === this.accountId
    },
  },

  methods: {
    async deleteAsset () {
      try {
        await api.postOperations(base.xdr.RemoveAssetOp(this.asset.code))
      } catch (error) {
        ErrorHandler.process(error)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';

.asset-actions {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: -1rem;
  margin-left: -1rem;
  width: calc(100% + 1rem);
}

.asset-actions__btn {
  max-width: 12rem;
  width: 100%;
  margin-top: 1rem;
  margin-left: 1rem;
}

</style>
