<template>
  <div class="asset-card">
    <card>
      <card-logo
        slot="media"
        :img-url="asset.logo.publicUrl"
        :logo-text="asset.name"
      />
      <template slot="header">
        {{ asset.code }}
      </template>
      <template slot="subhead">
        {{ asset.name }}
      </template>
      <template slot="accent-title">
        <span :title="assetBalance | formatMoney">
          {{
            'assets-list.list-item-balance-line' |
              globalize({ value: assetBalance})
          }}
        </span>
      </template>
      <template slot="content">
        {{ asset.description }}
      </template>
      <template slot="actions">
        <button
          v-ripple
          class="app__button-flat"
          @click="showDetails"
        >
          {{ 'asset-card.details-lbl' | globalize }}
        </button>
      </template>
    </card>

    <drawer :is-shown.sync="isDrawerShown">
      <template v-if="isAssetFormShown">
        <template slot="heading">
          {{ 'assets.update-drawer-title' | globalize }}
        </template>

        <asset-form
          :former="former"
          @submitted="onAssetUpdate"
        />
      </template>

      <template v-else>
        <template slot="heading">
          {{ 'assets.details-drawer-title' | globalize }}
        </template>

        <asset-attributes-viewer
          :asset="asset"
          :balance="assetBalance.value"
        />

        <div class="assets-renderer__actions">
          <asset-actions
            :asset="asset"
            :is-account-unverified="isAccountUnverified"
            :is-account-general="isAccountGeneral"
            :is-account-us-accredited="isAccountUsAccredited"
            :is-account-us-verified="isAccountUsVerified"
            :is-account-corporate="isAccountCorporate"
            @update-click="showUpdateForm"
            @balance-added="loadAssets() || (isDrawerShown = false)"
          />
        </div>
      </template>
    </drawer>
  </div>
</template>

<script>
import Card from '@/vue/common/Card'
import CardLogo from '@/vue/common/CardLogo'
import AssetAttributesViewer from './AssetAttributesViewer'
import AssetActions from './AssetActions'
import Drawer from '@/vue/common/Drawer'
import AssetForm from '@/vue/forms/AssetForm'

import { AssetRecord } from '@/js/records/entities/asset.record'
import { AssetFormer } from '@/js/formers/AssetFormer'
import { mapGetters, mapActions } from 'vuex'
import { vuexTypes } from '@/vuex'

export default {
  name: 'asset-card',
  components: {
    Card,
    CardLogo,
    AssetAttributesViewer,
    AssetActions,
    AssetForm,
    Drawer,
  },

  props: {
    asset: { type: AssetRecord, required: true },
  },

  data: _ => ({
    former: new AssetFormer(),
    isDrawerShown: false,
    isAssetFormShown: false,
  }),

  computed: {
    ...mapGetters([
      vuexTypes.accountBalances,
      vuexTypes.isAccountUnverified,
      vuexTypes.isAccountGeneral,
      vuexTypes.isAccountUsVerified,
      vuexTypes.isAccountUsAccredited,
      vuexTypes.isAccountCorporate,
    ]),

    assetBalance () {
      const record = this.accountBalances
        .find(item => item.asset.code === this.asset.code)
      return {
        value: record ? record.balance : '',
        currency: this.asset.code,
      }
    },
  },

  methods: {
    ...mapActions({
      loadAssets: vuexTypes.LOAD_ASSETS,
    }),

    showUpdateForm () {
      this.former = new AssetFormer(this.asset)
      this.isAssetFormShown = true
    },

    onAssetUpdate () {
      this.isDrawerShown = false
      this.$emit('update-list')
    },

    showDetails () {
      this.isAssetFormShown = false
      this.isDrawerShown = true
    },
  },
}
</script>
