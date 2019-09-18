<template>
  <div class="business-assets-viewer">
    <div class="app__table app__table--last-td-to-right">
      <table class="business-assets-viewer__table">
        <thead>
          <tr>
            <th
              class="business-assets-viewer__asset-name"
              :title="'business-assets-viewer.asset-name-th' | globalize"
            >
              {{ 'business-assets-viewer.asset-name-th' | globalize }}
            </th>
            <!-- eslint-disable-next-line max-len -->
            <th :title="'business-assets-viewer.number-of-holders-th' | globalize">
              {{ 'business-assets-viewer.number-of-holders-th' | globalize }}
            </th>
            <th>
              <!-- actions -->
            </th>
          </tr>
        </thead>

        <tbody v-if="businessAssets.length">
          <tr
            v-for="businessAsset in businessAssets"
            :key="businessAsset.asset.code"
          >
            <td
              class="business-assets-viewer__asset-name"
            >
              {{ businessAsset.asset.name }}
            </td>

            <td>
              {{ businessAsset.holders }}
            </td>

            <td>
              <button
                class="business-assets-viewer__sponsor-btn"
                @click="selectItem(businessAsset)"
              >
                {{ 'business-assets-viewer.sponsor-btn' | globalize }}
              </button>
            </td>
          </tr>
        </tbody>

        <empty-tbody-placeholder
          v-else-if="isLoaded"
          :colspan="3"
          :message="'business-assets-viewer.no-data-msg' | globalize"
        />

        <empty-tbody-placeholder
          v-else-if="isLoadFailed"
          :colspan="3"
          :message="'business-assets-viewer.error-msg' | globalize"
        />

        <skeleton-loader-table-body
          v-else
          :cells="3"
          template="smallString"
        />
      </table>
    </div>

    <drawer :is-shown.sync="isDrawerShown">
      <template slot="heading">
        {{ 'sponsor-business-form.form-heading' | globalize }}
      </template>
      <sponsor-business-form
        :business-asset="currentBusinessAsset"
        @contract-created="closeDrawer"
      />
    </drawer>
  </div>
</template>

<script>
import EmptyTbodyPlaceholder from '@/vue/common/EmptyTbodyPlaceholder'
import SkeletonLoaderTableBody from '@/vue/common/skeleton-loader/SkeletonLoaderTableBody'
import Drawer from '@/vue/common/Drawer'
import SponsorBusinessForm from '@/vue/forms/SponsorBusinessForm'
import { BusinessAssetRecord } from '@/js/records/entities/business-asset.record'
import { mapGetters, mapActions } from 'vuex'
import { vuexTypes } from '@/vuex'
import { BusinessRecord } from '@/js/records/entities/business.record'
import { api } from '@/api'
import { ErrorHandler } from '@/js/helpers/error-handler'

export default {
  name: 'business-assets-viewer',

  components: {
    EmptyTbodyPlaceholder,
    SkeletonLoaderTableBody,
    Drawer,
    SponsorBusinessForm,
  },

  props: {
    business: {
      type: BusinessRecord,
      required: true,
    },
  },

  data () {
    return {
      businessAssets: [],
      currentBusinessAsset: {},
      isLoaded: true,
      isLoadFailed: false,
      isDrawerShown: false,
    }
  },

  computed: {
    ...mapGetters([
      vuexTypes.accountId,
      vuexTypes.assetsByOwner,
    ]),
  },

  async created () {
    await this.init()
  },

  methods: {
    ...mapActions({
      loadBalances: vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS,
    }),

    async init () {
      try {
        await this.loadBalances()
        await this.loadingBusinessAssetsViaLoop()
        this.isLoaded = true
      } catch (e) {
        this.isLoadFailed = true
        ErrorHandler.processWithoutFeedback(e)
      }
    },

    selectItem (item) {
      this.currentBusinessAsset = item
      this.isDrawerShown = true
    },

    async loadingBusinessAssetsViaLoop () {
      let response = await api.getWithSignature(
        `/integrations/dns/businesses/${this.business.accountId}/assets`
      )
      let assets = response.data
      let holders = response._rawResponse.data.meta

      while (response.data.length) {
        response = await response.fetchNext()
        assets = [...assets, ...response.data]
        Object.assign(holders, response._rawResponse.data.meta)
      }

      this.businessAssets = assets
        .map(asset => new BusinessAssetRecord(asset, holders))
    },

    closeDrawer () {
      this.isDrawerShown = false
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';

.business-assets-viewer__sponsor-btn {
  font-size: 1.2rem;
  color: $col-primary-lighten;
}

.business-assets-viewer__asset-name {
  min-width: 12rem;
}
</style>
