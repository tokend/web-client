<template>
  <section
    v-show="isActive"
    :aria-hidden="! isActive"
    class="app-tabs__panel"
    :id="hash"
    role="tabpanel"
  >
    <slot />
  </section>
</template>

<script>
export default {
  props: {
    id: { type: String, required: false, default: '' },
    name: { type: String, required: true, default: '' },
    prefix: { type: String, required: false, default: '' },
    suffix: { type: String, required: false, default: '' },
    isDisabled: { type: Boolean, required: false, default: false },
  },

  data: () => ({
    isActive: false,
    isVisible: true,
  }),

  computed: {
    header () {
      return this.prefix + this.name + this.suffix
    },

    hash () {
      if (this.isDisabled) return '#'

      return this.id
        ? '#' + this.id
        : '#' + this.name.toLowerCase().replace(/ /g, '-')
    },
  },
}
</script>

<style lang="scss">
  .app-tabs__panel {
    padding: 1.6rem;
  }
</style>
