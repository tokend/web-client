<template>
  <div class="timeline">
    <button
      v-ripple
      class="app__button-raised"
      @click="handleAddClick"
      v-if="sale.owner === accountId">
      {{ i18n.sale_new_update() }}
    </button>
    <div class="timeline__timeline-item-list">
      <timeline-item
        class="timeline__timeline-item"
        v-for="(item, i) in items"
        :key="i"
        :title="item.title"
        :date="i18n.d(item.date)"
        :message="linkify(item.message)"
      />
    </div>
  </div>
</template>

<script>
import TimelineItem from './UpdatesTab.Timeline.Item'
import { commonEvents } from 'L@/js/events/common_events'
import { i18n } from 'L@/js/i18n'
import { mapGetters } from 'vuex'
import { vuexTypes } from 'L@/vuex/types'
export default {
  name: 'updates-tab-timeline',
  components: {
    TimelineItem
  },
  props: {
    sale: { type: Object, default: () => { } },
    items: { type: Array, default: () => [] }
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
      const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/ig
      return text.replace(
        urlRegex,
        (url) => '<a href="' + url + '" target="_blank">' + url + '</a>'
      )
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~L@scss/mixins";
@import "~L@scss/variables";

.timeline {
  position: relative;
  max-width: 700px;
}

.timeline__timeline-item-list {
  margin-top: 32px;
}

.timeline__timeline-item {
  margin-bottom: 1rem;
}
</style>
