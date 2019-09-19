<template>
  <div class="sponsorship-page">
    <template>
      <top-bar>
        <template slot="main">
          <!-- eslint-disable max-len -->
          <template v-if="getModule().canRenderSubmodule(BusinessesAllPageModule)">
            <router-link :to="vueRoutes.sponsorshipAllBusinesses">
              <span>{{ 'sponsorship-page.businesses-tab' | globalize }}</span>
            </router-link>
          </template>

          <router-link
            v-if="getModule().canRenderSubmodule(SponsorshipIncomingRequestsPageModule)"
            :to="vueRoutes.sponsorshipIncomingRequests"
          >
            <span>
              {{ 'sponsorship-page.incoming-requests-tab' | globalize }}
            </span>
          </router-link>

          <router-link
            v-if="getModule().canRenderSubmodule(SponsorshipOutgoingRequestsPageModule)"
            :to="vueRoutes.sponsorshipOutgoingRequests"
          >
            <span>
              {{ 'sponsorship-page.outgoing-requests-tab' | globalize }}
            </span>
          </router-link>
          <!-- eslint-enable max-len -->
        </template>
      </top-bar>
    </template>

    <router-view />
  </div>
</template>

<script>
import TopBar from '@/vue/common/TopBar'
import { vueRoutes } from '@/vue-router/routes'
import { SponsorshipIncomingRequestsPageModule } from '@/vue/pages/sponsorship-incoming-requests-page-module'
import { SponsorshipOutgoingRequestsPageModule } from '@/vue/pages/sponsorship-outgoing-requests-page-module'
import { BusinessesAllPageModule } from '@/vue/pages/businesses-all-page-module'

export default {
  name: 'sponsorship',
  components: {
    TopBar,
  },
  data: _ => ({
    vueRoutes,
    SponsorshipIncomingRequestsPageModule,
    SponsorshipOutgoingRequestsPageModule,
    BusinessesAllPageModule,
  }),
}
</script>
