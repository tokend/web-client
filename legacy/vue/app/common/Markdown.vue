<template>
  <vue-markdown
    class="markdown"
    :source="source"
    :prerender="replaceHtmlBreaks"
    :html="false"
    :anchor-attributes="anchorAttributes"
  />
</template>

<script>
import VueMarkdown from 'vue-markdown'
export default {
  name: 'markdown',

  components: { VueMarkdown },

  props: {
    source: { type: String, required: true },
    anchorAttributes: {
      type: Object,
      default () {
        return { target: '_blank', rel: 'noopener' }
      }
    }
  },

  methods: {
    replaceHtmlBreaks (str) {
      str = str || ''
      const re = /<br>\s*<\/br>|<br\s*\/>|<br>/gi
      const newLineSequence = '&nbsp;  \n'
      return str.replace(re, newLineSequence)
    }
  }
}
</script>

<style lang="scss">
@import "~L@scss/variables";

.markdown {
  line-height: 1.5;

  a {
    text-decoration: underline;
  }
}
</style>
