<template>
  <div class="verification-general-2">
    <submodule-importer
      :submodule="getModule().getSubmodule(VerificationGeneralFormModule)"
    />
  </div>
</template>

<script>
import { VerificationGeneralFormModule } from '@/vue/modules/verification/general-form/module'
import SubmoduleImporter from '@/modules-arch/submodule-importer'

export default {
  name: 'verification-general-2',
  components: {
    SubmoduleImporter,
  },
  data: _ => ({
    VerificationGeneralFormModule,
  }),
}
</script>

<style scoped>

</style>
