<template>
  <div class="overview">
    <template v-if="description">
      <markdown
        class="description__markdown-formatter"
        :source="description"
      />
    </template>

    <template v-else>
      <p class="text danger">
        {{ 'sale_no_overview' | translate }}
      </p>
    </template>
  </div>
</template>

<script>
import Markdown from 'L@/vue/app/common/Markdown'

export default {
  components: { Markdown },
  props: { description: { type: String, default: '' } }
}
</script>

<style lang="scss" scoped>
@import "~L@scss/variables";
@import "~L@scss/mixins";

.description__markdown-formatter {
  text-align: justify;
  color: $col-text-page-explanations;
}
</style>
