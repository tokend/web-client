<template>
  <div class="campaigns-list">
    <top-bar>
      <template slot="extra">
        <router-link
          tag="button"
          class="app__button-raised"
          :to="vueRoutes.campaignsCreate"
        >
          {{ 'campaigns-list.create-btn' | globalize }}
        </router-link>
      </template>
    </top-bar>
    <template v-if="isLoaded">
      <template v-if="isLoadFailed">
        <div class="campaigns-list__error-message">
          {{ 'campaigns-list.loading-error-msg' | globalize }}
        </div>
      </template>
      <template v-else-if="campaigns.length">
        <div class="campaigns-list__wrapper">
          <campaign-card
            v-for="(campaign, idx) in campaigns"
            :key="idx"
            :campaign="campaign"
          />
        </div>
      </template>
      <template v-else>
        <no-data-message
          icon-name=""
          :title="'campaigns-list.no-data-title' | globalize"
          :message="'campaigns-list.no-data-message' | globalize"
        />
      </template>
    </template>
    <template v-else>
      <div class="campaigns-list__wrapper">
        <sale-skeleton-loader
          v-for="(index, idx) in campaigns"
          class="sales__sale-card"
          :key="`skeleton-loader-${idx}`"
        />
      </div>
    </template>
  </div>
</template>

<script>
import SaleSkeletonLoader from '@/vue/pages/sales/SaleSkeletonLoader'
import TopBar from '@/vue/common/TopBar'
import NoDataMessage from '@/vue/common/NoDataMessage'
import CampaignCard from '@/vue/pages/Campaigns/CampaignCard'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { CampaignRecord } from '@/js/records/entities/campaign.record'
import { sleep } from '@/js/helpers/sleep-helper'
import { vueRoutes } from '@/vue-router/routes'
import { mapGetters } from 'vuex'

export default {
  name: 'campaigns-list',
  components: { SaleSkeletonLoader, CampaignCard, TopBar, NoDataMessage },
  data () {
    return {
      isLoaded: false,
      isLoadFailed: false,
      campaigns: [],
      vueRoutes,
    }
  },
  computed: {
    ...mapGetters([
      'isShowAllCampaigns',
    ]),
  },
  async created () {
    await this.loadCampaigns()
  },
  methods: {
    async loadCampaigns () {
      this.isLoaded = false
      this.isLoadFailed = false
      try {
        this.campaigns = [
          new CampaignRecord({
            name: 'UK student accomodation investment - Bell coins',
            logo: require('@static/images/belfast.jpg'),
          }),
        ]
        if (this.isShowAllCampaigns) {
          this.campaigns.splice(0, 0, new CampaignRecord({
            name: 'Opus by Zaha Hadid Architects',
            logo: require('@static/images/buildings.jpg'),
          }))
        }
        await sleep(1000)
      } catch (error) {
        this.isLoadFailed = true
        ErrorHandler.process(error)
      }
      this.isLoaded = true
    },
  },
}
</script>

<style lang="scss" scoped>
.campaigns-list__wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fill, 30%);
  grid-gap: 3rem;
}
</style>
