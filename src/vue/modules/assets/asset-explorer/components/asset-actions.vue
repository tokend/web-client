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
      v-if="!isAssetOwner"
      v-ripple
      class="app__button-raised asset-actions__btn"
      @click="isRedeemDrawerShown = true"
    >
      {{ 'assets.redeem-btn' | globalize }}
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

    <drawer :is-shown.sync="isRedeemDrawerShown">
      <template slot="heading">
        {{ 'redeem-form.form-heading' | globalize }}
      </template>
      <redeem-form
        :asset-code="asset.code"
      />
    </drawer>
  </div>
</template>

<script>
import { AssetRecord } from '@/js/records/entities/asset.record'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

import TransferForm from '@/vue/forms/TransferForm'
import RedeemForm from '@/vue/forms/RedeemForm'
import Drawer from '@/vue/common/Drawer'
import { api } from '@/api'
import { base } from '@tokend/js-sdk'
import { Bus } from '@/js/helpers/event-bus'

import { ErrorHandler } from '@/js/helpers/error-handler'

const EVENTS = {
  assetTransfered: 'asset-transfered',
  updateAsset: 'update-asset',
  assetDeleted: 'asset-deleted',
}

export default {
  name: 'asset-actions',

  components: {
    TransferForm,
    RedeemForm,
    Drawer,
  },
  props: {
    asset: { type: AssetRecord, required: true },
  },
  data: _ => ({
    isTransferDrawerShown: false,
    isRedeemDrawerShown: false,
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
      const operation = base.RemoveAssetOpBuilder
        .removeAssetOp({
          code: this.asset.code,
        })
      try {
        await this.deleteAssetPairs()
        await api.postOperations(operation)
        Bus.success('asset-actions.asset-deleted-msg')
        this.$emit(EVENTS.assetDeleted)
      } catch (error) {
        ErrorHandler.process(error)
      }
    },
    async deleteAssetPairs () {
      const { data } = await api.get('/v3/asset_pairs', {
        filter: { asset: this.asset.code },
      })
      const promises = data.map(async assetPair => {
        let response = await api.postOperations(base.RemoveAssetPairOpBuilder
          .removeAssetPairOp({
            base: assetPair.baseAsset.id,
            quote: assetPair.quoteAsset.id,
          }))
        return response
      })
      await Promise.all(promises)
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
