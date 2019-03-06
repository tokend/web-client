<template>
  <div class="assets-renderer">
    <template v-if="isLoaded">
      <drawer :is-shown.sync="isDrawerShown">
        <template v-if="isUpdateMode">
          <template slot="heading">
            {{ 'assets.update-drawer-title' | globalize }}
          </template>

          <asset-update-form
            :asset-record="selectedAsset"
            @close="isDrawerShown = false"
          />
        </template>

        <template v-else>
          <template slot="heading">
            {{ 'assets.details-drawer-title' | globalize }}
          </template>

          <asset-attributes-viewer
            :asset="selectedAsset"
            :storage-url="config.storageURL"
          />

          <div class="assets-renderer__actions">
            <asset-actions-bar
              :asset="selectedAsset"
              @update-ask="isUpdateMode = true"
              @balance-added="initFirstPageLoader() || (isDrawerShown = false)"
            />
          </div>
        </template>
      </drawer>

      <div class="assets-renderer__asset-list-wrp">
        <div
          v-if="assets.length"
          class="assets-renderer__asset-list"
        >
          <template v-for="asset in assets">
            <card-viewer
              :asset="asset"
              :storage-url="config.storageURL"
              :key="asset.code"
              @click="selectAsset(asset)"
            />
          </template>
        </div>

        <no-data-message
          v-else
          icon-name="trending-up"
          title-id="assets.no-assets-title"
          message-id="assets.no-assets-msg"
        />
      </div>
    </template>

    <template v-else-if="isLoadFailed">
      <p class="assets-renderer__error-msg">
        {{ 'assets.loading-error-msg' | globalize }}
      </p>
    </template>

    <template v-else>
      <load-spinner message-id="assets.assets-loading-msg" />
    </template>

    <div class="assets-renderer__collection-loader-wrp">
      <collection-loader
        v-show="isLoaded && assets.length"
        :first-page-loader="firstPageLoader"
        :page-limit="ASSETS_PER_PAGE"
        @first-page-load="setAssets"
        @next-page-load="concatAssets"
      />
    </div>
  </div>
</template>

<script>
import Drawer from '@/vue/common/Drawer'
import LoadSpinner from '@/vue/common/Loader'
import NoDataMessage from '@/vue/common/NoDataMessage'
import CollectionLoader from '@/vue/common/CollectionLoader'

import CardViewer from '../../shared/components/card-viewer'
import AssetAttributesViewer from '../../shared/components/asset-attributes-viewer'
import AssetActionsBar from './asset-actions-bar'
import AssetUpdateForm from '@/vue/forms/AssetUpdateForm'

import { mapGetters, mapActions, mapMutations } from 'vuex'
import { types } from '../store/types'

import { ErrorHandler } from '@/js/helpers/error-handler'

const ASSETS_PER_PAGE = 12

export default {
  name: 'assets-renderer',
  components: {
    Drawer,
    LoadSpinner,
    NoDataMessage,
    CollectionLoader,
    CardViewer,
    AssetAttributesViewer,
    AssetActionsBar,
    AssetUpdateForm,
  },

  props: {
    config: {
      type: Object,
      required: true,
    },
  },

  data: _ => ({
    isLoaded: false,
    isLoadFailed: false,
    isDrawerShown: false,
    isUpdateMode: false,
    selectedAsset: {},
    firstPageLoader: _ => {},
    ASSETS_PER_PAGE,
  }),

  computed: {
    ...mapGetters('asset-explorer', {
      assets: types.assets,
    }),
  },

  created () {
    this.initFirstPageLoader()
  },

  methods: {
    ...mapMutations('asset-explorer', {
      setAssets: types.SET_ASSETS,
      concatAssets: types.CONCAT_ASSETS,
    }),

    ...mapActions('asset-explorer', {
      loadAssets: types.LOAD_ASSETS,
    }),

    initFirstPageLoader () {
      this.firstPageLoader = _ => this.loadAssetsPage()
    },

    async loadAssetsPage () {
      this.isLoaded = false
      try {
        const response = await this.loadAssets({
          page: {
            limit: ASSETS_PER_PAGE,
          },
        })
        this.isLoaded = true
        return response
      } catch (e) {
        this.isLoadFailed = true
        ErrorHandler.processWithoutFeedback()
      }
    },

    selectAsset (asset) {
      this.selectedAsset = asset
      this.isUpdateMode = false
      this.isDrawerShown = true
    },
  },
}
</script>

<style scoped>
.assets-renderer__collection-loader-wrp {
  margin-top: 1.5rem;
}

.assets-renderer__actions {
  margin-top: 4.9rem;
}

.assets-renderer__asset-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  margin: -.75rem;
}
</style>
