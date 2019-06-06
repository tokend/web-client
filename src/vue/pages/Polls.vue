<template>
  <div>
    <template>
      <top-bar>
        <template slot="main">
          <router-link
            to="/"
          >
            <span>
              All polls
            </span>
          </router-link>
          <router-link
            to="/"
          >
            <span>
              My polls
            </span>
          </router-link>
          <!-- eslint-disable max-len -->
          <router-link
            v-if="getModule().canRenderSubmodule(PollRequestsModule)"
            :to="vueRoutes.pollRequests"
          >
            <span>
              Polls requests
            </span>
          </router-link>
          <!-- eslint-enable max-len -->
          <skeleton-loader
            v-else
            template="smallString"
          />
        </template>
      </top-bar>
    </template>
    <router-view />
  </div>
</template>

<script>
import TopBar from '@/vue/common/TopBar'
import { PollRequestsModule } from '@/vue/modules/requests/poll-requests/module'
import SkeletonLoader from '@/vue/common/skeleton-loader/SkeletonLoader'
import { vueRoutes } from '@/vue-router/routes'

export default {
  name: 'polls',
  components: {
    TopBar,
    SkeletonLoader,
  },
  data: _ => ({
    vueRoutes,
    PollRequestsModule,
  }),
}
</script>

<style scoped lang="scss"/>
