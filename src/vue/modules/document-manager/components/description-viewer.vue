<template>
  <div class="description-viewer">
    <vue-markdown :source="description" />
  </div>
</template>

<script>
import VueMarkdown from 'vue-markdown'

export default {
  name: 'description-viewer',
  components: {
    VueMarkdown,
  },
  props: {
    description: {
      type: String,
      required: true,
    },
  },
}
</script>

<style lang="scss">
.description-viewer {
  text-align: justify;

  h1 { margin: 3rem 0 }
  h2 { margin: 2rem 0 }
  h3 { margin: 1.5rem 0 }
  h4 { margin: 1.25rem 0 }
  h5 { margin: 1.15rem 0 }
  h6 { margin: 1.10rem 0 }

  p { margin: 1rem 0 }
}
</style>
