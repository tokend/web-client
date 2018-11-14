<template>
  <div class="timeline">
    <md-button
      class="timeline__add-btn"
      @click="handleAddClick"
      v-if="sale.owner === accountId"
    >
      {{ i18n.sale_new_update() }}
    </md-button>
    <timeline-item
      class="timeline__timeline-item"
      v-for="(item, i) in items"
      :key="i"
      :title="item.title"
      :date="i18n.d(item.date)"
      :message="linkify(item.message)"
    />
  </div>
</template>

<script>
import TimelineItem from './UpdatesTab.Timeline.Item'
import { commonEvents } from '../../../../../js/events/common_events'
import { i18n } from '../../../../../js/i18n/index'
import { mapGetters } from 'vuex'
import { vuexTypes } from '../../../../../vuex/types'
export default {
  name: 'timeline',

  components: {
    TimelineItem
  },
  props: {
    sale: { type: Object, default: undefined },
    items: { type: Object, default: undefined }
  },
  data: _ => ({
    i18n
  }),
  computed: {
    ...mapGetters([
      vuexTypes.accountId
    ])
  },
  methods: {
    handleAddClick () {
      this.$emit(commonEvents.timelineAddClick)
    },
    linkify (text) {
      /*eslint-disable*/
        const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig
        /* eslint-enable */
      return text.replace(urlRegex, (url) => '<a href="' + url + '" target="_blank">' + url + '</a>')
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../../../../../scss/mixins";
  @import "../../../../../scss/variables";

  .timeline {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
  }

  .timeline__timeline-item {
    margin-bottom: 1rem;
  }

</style>
