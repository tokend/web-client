<template>
  <vue-markdown
    class="markdown-formatter"
    :source="source"
    :prerender="prerender"
    :html="false"
    :anchor-attributes="{ target: '_blank' }"
  />
</template>

<script>
import VueMarkdown from 'vue-markdown'
export default {
  components: {
    VueMarkdown
  },

  props: {
    source: { type: String, default: '' }
  },

  created () {
  },
  methods: {
    prerender (str) {
      str = str || ''
      const re = /<br>\s*<\/br>|<br\s*\/>|<br>/gi
      const newLineSequence = '&nbsp;  \n'
      return str.replace(re, newLineSequence)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
