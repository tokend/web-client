<template>
  <div class="create-asset-requests">
    <template>
      <drawer :is-shown.sync="isDrawerShown">
        <template v-if="isUpdateFormShown">
          <template slot="heading">
            {{ 'create-asset-requests.update-asset-title' | globalize }}
          </template>
          <create-asset-form-module
            :collector="collector"
            @submitted="closeDrawerAndUpdateList()"
          />
        </template>

        <template v-else>
          <template slot="heading">
            {{ 'create-asset-requests.details-title' | globalize }}
          </template>
          <request-viewer
            :request="selectedRequest"
            @update-click="showUpdateForm()"
            @cancel="closeDrawerAndUpdateList()"
          />
        </template>
      </drawer>

      <requests-table
        :requests="requests"
        :is-loaded="isLoaded"
        @select="showRequestDetails"
      />
    </template>

    <p v-if="isLoadingFailed">
      {{ 'create-asset-requests.loading-error-msg' | globalize }}
    </p>

    <collection-loader
      class="create-asset-requests__loader"
      v-show="requests.length && isLoaded"
      :first-page-loader="firstPageLoader"
      @first-page-load="setRequests"
      @next-page-load="concatRequests"
    />
  </div>
</template>

<script>
import Drawer from '@/vue/common/Drawer'
import CollectionLoader from '@/vue/common/CollectionLoader'

import RequestViewer from './components/request-viewer'
import RequestsTable from './components/requests-table'
import { CreateAssetRequest } from './wrappers/create-asset-request'

import CreateAssetFormModule from '@modules/create-asset-form'

import { mapActions, mapMutations, mapGetters } from 'vuex'
import { types } from './store/types'

import { ErrorHandler } from '@/js/helpers/error-handler'
import UpdateList from '@/vue/mixins/update-list.mixin'
import { AssetCollector } from '@/js/collectors/AssetCollector'
import { DocumentContainer } from '@/js/helpers/DocumentContainer'

export default {
  name: 'create-asset-requests-module',
  components: {
    Drawer,
    CollectionLoader,
    RequestsTable,
    RequestViewer,
    CreateAssetFormModule,
  },

  mixins: [UpdateList],

  data: _ => ({
    isLoaded: false,
    isLoadingFailed: false,
    isDrawerShown: false,
    isUpdateFormShown: false,
    selectedRequest: new CreateAssetRequest({}),
    collector: new AssetCollector('create'),
    firstPageLoader: () => { },
  }),

  computed: {
    ...mapGetters('create-asset-requests', {
      requests: types.requests,
    }),
  },

  async created () {
    this.initFirstPageLoader()
    await this.loadAssetTypes()
    this.listenUpdateList('createAssetRequests:updateList', this.initFirstPageLoader)
  },

  beforeDestroy () {
    this.resetUpdateListEvent('createAssetRequests:updateList')
  },

  methods: {
    ...mapMutations('create-asset-requests', {
      setRequests: types.SET_REQUESTS,
      concatRequests: types.CONCAT_REQUESTS,
    }),

    ...mapActions('create-asset-requests', {
      loadCreateAssetRequests: types.LOAD_REQUESTS,
      loadKycRequiredAssetType: types.LOAD_KYC_REQUIRED_ASSET_TYPE,
      loadSecurityAssetType: types.LOAD_SECURITY_ASSET_TYPE,
    }),

    async loadAssetTypes () {
      try {
        await this.loadKycRequiredAssetType()
        await this.loadSecurityAssetType()
      } catch (e) {
        ErrorHandler.processWithoutFeedback(e)
      }
    },

    async loadRequests () {
      this.isLoaded = false
      try {
        const response = await this.loadCreateAssetRequests()
        this.isLoaded = true
        return response
      } catch (e) {
        this.isLoadingFailed = true
        ErrorHandler.processWithoutFeedback(e)
      }
    },

    initFirstPageLoader () {
      this.firstPageLoader = _ => this.loadRequests()
    },

    showRequestDetails (request) {
      this.isUpdateFormShown = false
      this.selectedRequest = request
      this.isDrawerShown = true
    },

    showUpdateForm () {
      this.collector.add({
        requestId: this.selectedRequest.id,
        code: this.selectedRequest.assetCode,
        policies: this.selectedRequest.policy,
        assetType: this.selectedRequest.assetType,
        maxIssuanceAmount: this.selectedRequest.maxIssuanceAmount,
        preIssuanceAssetSigner: this.selectedRequest.preIssuanceAssetSigner,
        initialPreissuedAmount: this.selectedRequest.initialPreissuedAmount,
        name: this.selectedRequest.assetName,
        logo: this.selectedRequest.logoKey
          ? new DocumentContainer(this.selectedRequest.logo)
          : null,
        terms: this.selectedRequest.termsKey
          ? new DocumentContainer(this.selectedRequest.terms)
          : null,
        stellarIntegration: {
          isWithdrawable: this.selectedRequest.stellarWithdraw,
          isDepositable: this.selectedRequest.stellarDeposit,
          assetType: this.selectedRequest.stellarAssetType,
          assetCode: this.selectedRequest.stellarAssetCode,
        },
        erc20Integration: {
          isWithdrawable: this.selectedRequest.erc20Withdraw,
          isDepositable: this.selectedRequest.erc20Deposit,
          address: this.selectedRequest.erc20Address,
        },
      })

      this.isUpdateFormShown = true
    },

    closeDrawerAndUpdateList () {
      this.isDrawerShown = false
      this.emitUpdateList('createAssetRequests:updateList')
    },
  },
}
</script>

<style lang="scss" scoped>
.create-asset-requests__loader {
  margin-top: 1rem;
}
</style>
