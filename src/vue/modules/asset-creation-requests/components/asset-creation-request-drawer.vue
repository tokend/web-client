<template>
  <div class="">
    <template v-if="isUpdateMode">
      <template slot="heading">
        {{ 'asset-creation-requests.update-asset-title' | globalize }}
      </template>

      <asset-create-form
        v-if="isAssetCreateRequestSelected"
        :request="selectedRequest"
        @request-updated="closeDetailsDrawer() || initFirstPageLoader()"
        @close="closeDetailsDrawer"
      />

      <asset-update-form
        v-else
        :request="selectedRequest"
        :asset-for-update="selectedRequest.assetCode"
        @request-updated="closeDetailsDrawer() || initFirstPageLoader()"
        @close="closeDetailsDrawer"
      />
    </template>

    <template v-else>
      <template slot="heading">
        {{ 'asset-creation-requests.details-title' | globalize }}
      </template>

      <asset-request-details
        :request="selectedRequest"
        :is-pending="isRequestCancelling"
        @update="isUpdateMode = true"
        @cancel="cancelRequest"
      />
    </template>
  </div>
</template>

<script>
export default {
  name: 'asset-creation-request-drawer',

  methods: {
    // async cancelRequest () {
    //   this.isRequestCancelling = true
    //   try {
    //     const operation = base.ManageAssetBuilder.cancelAssetRequest({
    //       requestID: this.selectedRequest.id,
    //     })
    //     await api.postOperations(operation)
    //     // const { data } =
    // await Sdk.horizon.request.get(this.selectedRequest.id)
    //     // this.requestsHistory.splice(this.selectedIndex, 1,
    //     //   RecordWrapper.request(data)
    //     // )
    //     Bus.success('asset-creation-requests.request-canceled-msg')
    //   } catch (e) {
    //     ErrorHandler.process(e)
    //   }
    //   this.isRequestCancelling = false
    // },
  },
}
</script>
