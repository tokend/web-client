<template>
  <div class="sale-creation__request-list">
    <md-list class="md-double-line">
      <template v-for="request in list">
        <md-list-item
          :key="request.saleIndex"
          @click="$emit(commonEvents.saleSelectEvent, request)">
          <md-avatar class="md-avatar-icon">
            <img
              v-if="request.logoUrl"
              :src="request.logoUrl"
              alt="">
            <span v-else>{{ request.name.charAt(0) }}</span>
          </md-avatar>

          <div class="md-list-item-text">
            <span>{{ request.name }}</span>
            <span
              :class="`request-list__request
                      request-list__request--${request.state}`">
              {{ request.state || i18n.sale_in_process_of_creation() }}
            </span>
          </div>
          <md-icon class="md-primary">mode_edit</md-icon>
        </md-list-item>
      </template>
    </md-list>
  </div>
</template>

<script>
import { commonEvents } from '../../../js/events/common_events'
import { i18n } from '../../../js/i18n/index'

export default {
  name: 'request-list',
  props: { list: { type: Array, required: true } },
  data: _ => ({
    i18n,
    commonEvents
  })
}
</script>

<style lang="scss">
  @import '../../../scss/variables';

  .request-list__request {
    &--pending  { color: $col-pending !important; }
    &--approved { color: $col-success !important; }
    &--rejected { color: $col-reject  !important; }
  }
  .request-list {
    .request-list-button {
      align-self: auto !important;
    }
  }

.sale-creation__request-list {
  .md-list {
    background-color: transparent;
  }

  .md-list-item-button {
    margin-left: -16px;
  }

  .md-list-item-text {
    color: $col-list-text;
  }

  .md-list-item-text :nth-child(2) {
    color: rgba($col-list-text, .7) !important;
  }
}

</style>
