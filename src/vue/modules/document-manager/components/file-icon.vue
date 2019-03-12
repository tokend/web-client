<template>
  <i class="file-icon mdi" :class="className" />
</template>

<script>
const MIMES = Object.freeze({
  pdf: 'application/pdf',
  png: 'image/png',
  jpg: 'image/jpg',
  jpeg: 'image/jpeg',
})

export default {
  name: 'file-icon',
  props: {
    mime: {
      type: String,
      default: '',
    },
  },
  computed: {
    className () {
      switch (this.mime) {
        case MIMES.pdf:
          return 'mdi-file-pdf'
        case MIMES.png:
        case MIMES.jpg:
        case MIMES.jpeg:
          return 'mdi-file-image'
        default:
          return 'mdi-file'
      }
    },
  },
}
</script>

<style scoped>
.file-icon {
  font-size: 7rem;
}
</style>
