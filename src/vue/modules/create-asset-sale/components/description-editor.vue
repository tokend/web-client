<template>
  <div class="description-editor">
    <markdown-editor
      @input="onInput"
      :value="value"
      :sanitize="true"
      ref="markdownEditor"
      :configs="configs" />
  </div>
</template>

<script>
import MarkdownEditor from 'vue-simplemde/src/markdown-editor'

const EVENT = {
  input: 'input',
}

export default {
  name: 'description-editor',
  components: { MarkdownEditor },
  props: {
    value: { type: [String, Number], default: '' },
  },

  data () {
    return {
      content: '',
      configs: {
        toolbar: [
          'bold', 'italic', '|',
          'heading-1', 'heading-2', '|',
          'image', 'link', '|',
          'quote', 'unordered-list', 'ordered-list', '|',
          'preview', 'fullscreen',
        ],
        status: false,
        spellChecker: false,
      },
    }
  },

  computed: {
    simplemde () {
      return this.$refs.markdownEditor.simplemde
    },
  },

  mounted () {
    try {
      this.simplemde.togglePreview()

      this.simplemde.codemirror.on('beforeChange', (instance, changeObj) => {})
      this.$refs.markdownEditor.initialize()
      this.simplemde.toTextArea()
      this.simplemde.isPreviewActive()
      this.simplemde.isSideBySideActive()
      this.simplemde.isFullscreenActive()
      this.simplemde.clearAutosavedValue()
      this.simplemde.markdown(this.content)
      this.simplemde.codemirror.refresh()
    } catch (e) {}
  },

  methods: {
    onInput (value) {
      this.$emit(EVENT.input, value)
    },
  },
}
</script>

<style lang="scss">
  @import '~simplemde/dist/simplemde.min.css';
  @import '~@scss/variables';

  .description-editor {
    width: 100%;
    textarea {
      opacity: 0;
      width: 0;
      height: 0;
    }
  }

</style>
