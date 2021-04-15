<template>
  <div class="campaigns-create">
    <top-bar>
      <template slot="main">
        <div class="campaigns-create__title">
          {{ 'campaigns-create.title' | globalize }}
        </div>
      </template>
    </top-bar>
    <campaigns-form />
  </div>
</template>

<script>
import CampaignsForm from '@/vue/forms/CampaignsForm'
import TopBar from '@/vue/common/TopBar'
export default {
  name: 'campaigns-create',
  components: { TopBar, CampaignsForm },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';
@import '~@scss/mixins';

.campaigns-create__title {
  font-size: 3rem;
  font-weight: 500;
}
</style>
