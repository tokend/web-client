<template>
  <qr-code
    :value="value"
    :size="size"
    :background="background"
    :foreground="foreground"
    :class-name="className"
    :level="level"
  />
</template>

<script>
import QrCode from 'qrcode.vue'

export default {
  name: 'qrcode-wrapper',
  components: {
    QrCode,
  },
  props: {
    value: { type: String, default: '' },
    size: { type: Number, default: 200 },
    background: { type: String, default: '#000' },
    foreground: { type: String, default: '#fff' },
    className: { type: String, default: '' },
    level: { type: String, default: 'L' },
  },
}
</script>
