<template>
  <div class="card-list-renderer">
    <div class="card-list-renderer__inner">
      <template v-for="asset in assets">
        <card-viewer
          :asset="asset"
          :config="config"
          :key="asset.code"
          @click="$emit(EVENTS.select, asset)"
        />
      </template>
    </div>
  </div>
</template>

<script>
import CardViewer from './card-viewer'

const EVENTS = {
  select: 'select',
}

export default {
  name: 'card-list-renderer',
  components: {
    CardViewer,
  },
  props: {
    assets: { type: Array, default: _ => [] },
    config: { type: Object, required: true },
  },
  data: _ => ({
    EVENTS,
  }),
}
</script>

<style lang="scss" scoped>
.card-list-renderer__inner {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  margin: -.75rem;
}
</style>
