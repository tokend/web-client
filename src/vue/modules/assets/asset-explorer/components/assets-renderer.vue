<template>
  <div class="assets-renderer">
    <template v-if="isLoaded">
      <drawer :is-shown.sync="isDrawerShown">
        <template slot="heading">
          {{ 'assets.drawer-title' | globalize }}
        </template>
        <asset-attributes-viewer
          :asset="selectedAsset"
          :config="config"
        />

        <template v-if="!selectedAsset.balance">
          <div class="assets-renderer__add-balance-btn-wrp">
            <add-balance-btn :asset="selectedAsset" />
          </div>
        </template>
      </drawer>

      <div class="assets-renderer__asset-list-wrp">
        <card-list-renderer
          :assets="assets"
          :config="config"
          @select="selectAsset"
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
        :first-page-loader="loadAssetsPage"
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
import CollectionLoader from '@/vue/common/CollectionLoader'

import CardListRenderer from '../../shared/components/card-list-renderer'
import AssetAttributesViewer from '../../shared/components/asset-attributes-viewer'
import AddBalanceBtn from './add-balance-btn'

import { mapGetters, mapActions, mapMutations } from 'vuex'
import { types } from '../store/types'

import { ErrorHandler } from '@/js/helpers/error-handler'

const ASSETS_PER_PAGE = 12

export default {
  name: 'assets-renderer',
  components: {
    Drawer,
    LoadSpinner,
    CollectionLoader,
    CardListRenderer,
    AssetAttributesViewer,
    AddBalanceBtn,
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
    selectedAsset: {},
    ASSETS_PER_PAGE,
  }),

  computed: {
    ...mapGetters('asset-explorer', {
      assets: types.assets,
    }),
  },

  methods: {
    ...mapMutations('asset-explorer', {
      setAssets: types.SET_ASSETS,
      concatAssets: types.CONCAT_ASSETS,
    }),

    ...mapActions('asset-explorer', {
      loadAssets: types.LOAD_ASSETS,
    }),

    async loadAssetsPage () {
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
      this.isDrawerShown = true
    },
  },
}
</script>

<style scoped>
.assets-renderer__collection-loader-wrp {
  margin-top: 1.5rem;
}

.assets-renderer__add-balance-btn-wrp {
  margin-top: 4.9rem;
  display: flex;
}
</style>
