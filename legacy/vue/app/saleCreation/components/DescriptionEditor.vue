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
import { commonEvents } from '../../../../js/events/common_events'

export default {
  name: 'description-editor',
  components: { MarkdownEditor },
  props: {
    value: { type: [String, Number], required: true, default: '' || 0 }
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
          'preview', 'fullscreen'
        ],
        status: false,
        spellChecker: false
      }
    }
  },

  computed: {
    simplemde () {
      return this.$refs.markdownEditor.simplemde
    }
  },

  mounted () {
    try {
      this.simplemde.togglePreview()

      this.simplemde.codemirror.on('beforeChange', (instance, changeObj) => {
        // do some things
      })

      this.simplemde = null

      this.$refs.markdownEditor.initialize() // init
      this.simplemde.toTextArea()
      this.simplemde.isPreviewActive() // returns boolean
      this.simplemde.isSideBySideActive() // returns boolean
      this.simplemde.isFullscreenActive() // returns boolean
      this.simplemde.clearAutosavedValue() // no returned value
      this.simplemde.markdown(this.content) // returns parsed html
      this.simplemde.codemirror.refresh() // refresh codemirror
    } catch (e) {}
  },

  methods: {
    onInput (value) {
      this.$emit(commonEvents.inputEvent, value)
    }
  }
}
</script>

<style lang="scss">
  @import '../../../../../node_modules/simplemde/dist/simplemde.min.css';
  @import '~L@scss/variables';
  // @import '../../../../../assets/style/md';

  .description-editor {
    width: 100%;
    textarea {
      opacity: 0;
      width: 0;
      height: 0;
    }
  }

  .CodeMirror-fullscreen,
  .editor-toolbar.fullscreen {
    z-index: 45 !important;
  }

</style>
