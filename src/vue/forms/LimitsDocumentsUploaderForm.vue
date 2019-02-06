<template>
  <form class="app-form" @submit.prevent="submit">
    d
  </form>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'

export default {
  name: 'limits-documents-uploader-form',
  components: {
  },
  mixins: [FormMixin],
  props: {
    limits: { type: Object, required: true, default: () => ({}) },
  },
  data: () => ({
  }),
  computed: {
  },
  created () {
  },
  methods: {
    submit () {
    },
  },
}
</script>

<style lang="scss" scoped>
@import './app-form';
</style>
