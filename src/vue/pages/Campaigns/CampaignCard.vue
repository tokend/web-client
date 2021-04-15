<template>
  <router-link
    class="campaign-card app__card"
    :to="vueRoutes.campaignsDetails"
  >
    <div class="app__card-content">
      <img
        class="campaign-card__img"
        :src="campaign.logo"
      >
    </div>
    <div class="app__card-actions">
      <div class="campaign-card__name">
        {{ campaign.name }}
      </div>
    </div>
  </router-link>
</template>

<script>
import { vueRoutes } from '@/vue-router/routes'
import { CampaignRecord } from '@/js/records/entities/campaign.record'

export default {
  name: 'campaign-card',
  props: {
    campaign: {
      type: CampaignRecord,
      default: () => new CampaignRecord(),
    },
  },
  data () {
    return {
      vueRoutes,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';
@import '~@scss/mixins';

.campaign-card {
  text-decoration: none;
  text-transform: none;
}

.campaign-card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.campaign-card__name {
  margin: 0 auto;
  font-weight: 500;
  color: $col-primary;
  font-size: 2rem;
  line-height: 140%;
  text-align: center;
}
</style>
