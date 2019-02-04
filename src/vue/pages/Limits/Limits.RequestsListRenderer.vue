<template>
  <div v-if="!isLoading" class="limits-table-renderer__table app__table">
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
</template>

<script>
import Loader from '@/vue/common/Loader'
import { LIMITS_REQUEST_STATES_STR } from '@/js/const/limits.const'

export default {
  components: { Loader },
  props: {
    requests: { type: Array, required: true, default: () => [] },
    isLoading: { type: Boolean, required: true, default: false },
  },
  data: () => ({
    LIMITS_REQUEST_STATES_STR,
  }),
}
</script>

<style lang="scss">
@import "~@scss/variables";

.limits-table-renderer__table-item--inactive {
  color: rgba($col-text, .3);
}

</style>
