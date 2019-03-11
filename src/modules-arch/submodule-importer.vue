<template>
  <keep-alive v-if="isLoaded">
    <component
      :is="component"
      v-bind="$attrs"
    />
  </keep-alive>
  <div
    v-else
    class="submodule-importer__loader-wrp"
  >
    <slot name="loader" />
  </div>
</template>

<script>
import { ModuleDescriptor } from '@/modules-arch/module-descriptor'
import { ErrorHandler } from '@/js/helpers/error-handler'

export default {
  props: {
    submodule: {
      type: ModuleDescriptor,
      required: true,
    },
  },

  data () {
    return {
      component: null,
      isLoaded: false,
    }
  },

  async created () {
    try {
      await this.loadComponent()
    } catch (error) {
      ErrorHandler.processWithoutFeedback(error)
    }
    this.isLoaded = true
  },

  methods: {
    async loadComponent () {
      const { default: component } = await this.submodule.importComponent()
      this.component = component
    },
  },
}
</script>

<style scoped>
</style>
