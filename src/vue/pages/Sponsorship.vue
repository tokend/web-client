<template>
  <div class="sponsorship-page">
    <template>
      <top-bar>
        <template slot="main">
          <!-- eslint-disable max-len -->
          <router-link :to="vueRoutes.sponsorshipAllBusinesses">
            <span>{{ 'sponsorship-page.businesses-tab' | globalize }}</span>
          </router-link>

          <router-link
            :to="vueRoutes.sponsorshipIncomingRequests"
          >
            <span>
              {{ 'sponsorship-page.incoming-requests-tab' | globalize }}
            </span>
          </router-link>

          <router-link
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

export default {
  name: 'sponsorship',
  components: {
    TopBar,
  },
  data: _ => ({
    vueRoutes,
  }),
}
</script>
