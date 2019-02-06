<template>
  <div class="limits-table-renderer">
    <div v-if="!isLoading" class="limits-table-renderer__table">
      <table class="app__table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Request type</th>
            <th>State</th>
            <th>Asset</th>
            <th />
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, i) in requests"
            :key="`limits-requests-table-row-${i}`"
          >
            <td>{{ item.updatedAt | formatDate }}</td>
            <td>{{ item.requestType }}</td>
            <td>{{ item.state }}</td>
            <td>{{ item.asset }}</td>
            <td>
              <button
                class="app__button-raised"
                @click="openDocumentsUploaderForm(item)"
                :disabled="item.state !== LIMITS_REQUEST_STATES_STR.rejected"
              >
                Upload documents
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <loader v-else :message-id="'limits-table-renderer.data-loading'" />

    <drawer :is-shown.sync="isDocumentsUploaderFormShown">
      <template slot="heading">
        {{ 'limits.limits-form-heading' | globalize }}
      </template>
      <limits-documents-uploader-form
        @finished="hideDrawer"
        :limits="selectedLimitsList"
      />
    </drawer>
  </div>
</template>

<script>
import Loader from '@/vue/common/Loader'
import LimitsDocumentsUploaderForm from '@/vue/forms/LimitsDocumentsUploaderForm.vue'
import { LIMITS_REQUEST_STATES_STR } from '@/js/const/limits.const'

export default {
  name: 'limits-requests-list-renderer',
  components: {
    Loader,
    LimitsDocumentsUploaderForm,
  },
  props: {
    requests: { type: Array, required: true, default: () => [] },
    isLoading: { type: Boolean, required: true, default: false },
  },
  data: () => ({
    LIMITS_REQUEST_STATES_STR,
    isDocumentsUploaderFormShown: false,
    selectedRequest: null,
  }),
  methods: {
    hideDrawer () {
      this.isDocumentsUploaderFormShown = false
      this.selectedRequest = null
    },
    openDocumentsUploaderForm (request) {
      this.selectedRequest = request
      this.isDocumentsUploaderFormShown = true
    },
  },
}
</script>

<style lang="scss">
@import "~@scss/variables";

.limits-table-renderer__table-item--inactive {
  color: rgba($col-text, .3);
}

</style>
