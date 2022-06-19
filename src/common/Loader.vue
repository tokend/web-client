<template>
  <div class="loader">
    <template v-if="scheme === SCHEMES.spinner">
      <spinner />
    </template>
  </div>
</template>

<script lang="ts">
/* create skeletons */
import Spinner from '@/common/loader/Spinner.vue'

import { defineComponent } from 'vue'

const SCHEMES = {
  spinner: 'spinner',
}

export default defineComponent({
  name: 'loader',
  components: { Spinner },
  props: {
    scheme: {
      type: String,
      default: SCHEMES.spinner,
    },
  },
  setup() {
    return {
      SCHEMES,
    }
  },
})
</script>

<style lang="scss" scoped>
.loader {
  display: grid;
  place-items: center;
}
</style>
