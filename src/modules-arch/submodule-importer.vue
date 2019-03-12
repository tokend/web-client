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

/**
 * Asynchronously imports the component of the provided submodule and inserts it
 * to the DOM.
 *
 * You can provide all the attributes that the submodule component use, all of
 * them will be provided directly to the imported component.
 *
 * Usage:
 * <submodule-importer
 *   v-if="pageModule.hasSubmodule(TheSubmodule)
 *   :submodule="pageModule.getSubmodule(TheSubmodule)"
 *   :someSubmoduleAttr="..."
 *   :anotherSubmoduleAttr="..."
 * />
 *
 * If you want loader while the component being imported:
 * <submodule-importer
 *   v-if="pageModule.hasSubmodule(TheSubmodule)
 *   :submodule="pageModule.getSubmodule(TheSubmodule)"
 *   :someSubmoduleAttr="..."
 *   :anotherSubmoduleAttr="..."
 * >
 *   <div slot="loader">
 *     ...
 *   </div>
 * </submodule-importer
 */
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
