<template>
  <div class="markdown-field">
    <vue-simplemde
      ref="markdownEditor"
      v-on="$listeners"
      @input="onInput"
      :value="value"
      :sanitize="true"
      :configs="configs"
    />
    <div
      class="markdown-field__err-mes"
      v-if="errorMessage"
    >
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>
import VueSimplemde from 'vue-simplemde'

const EVENT = {
  input: 'input',
}

export default {
  name: 'markdown-field',
  components: { VueSimplemde },
  props: {
    value: { type: [String, Number], default: '' },
    errorMessage: { type: String, default: undefined },
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
@import 'scss/variables';

// Disabled because vue-markdown
/* stylelint-disable selector-nested-pattern */
.markdown-field {
  width: 100%;

  textarea {
    opacity: 0;
    width: 0;
    height: 0;
  }
}
/* stylelint-enable selector-nested-pattern */

.markdown-field__err-mes {
  color: $field-color-error;
  margin-top: $field-error-margin-top;
  font-size: $field-error-font-size;
  line-height: $field-error-line-height;
}
</style>
