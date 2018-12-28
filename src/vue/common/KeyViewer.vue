<template>
  <div class="key-viewer">
    <div class="key-viewer__qr-wrp">
      <qr-code
        :text="value"
        :margin="0"
        :size="200"
        :color-light="'#f2f2f4'"
        :color-dark="'#262626'"
      />
    </div>
    <div class="key-viewer__clipboard-wrp">
      <clipboard-field
        :id="value"
        :value="value"
        :label="'auth-pages.recovery-seed' | globalize"
      />
    </div>
  </div>
</template>

<script>
/**
 * KeyViewer accepts the key (recoverySeed/accountID/depositAddress etc) and
 * renders the qr-code and copyable field for it
 */
import QrCode from 'vue-qr'
import ClipboardField from '@/vue/fields/ClipboardField'

export default {
  name: 'key-viewer',
  components: {
    ClipboardField,
    QrCode
  },
  props: {
    value: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';

.key-viewer__qr-wrp {
  margin-bottom: 3rem;
  text-align: center;
}
</style>
