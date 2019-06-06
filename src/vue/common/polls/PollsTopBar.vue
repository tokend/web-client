<template>
  <div class="polls-top-bar">
    <template>
      <top-bar>
        <template slot="main">
          <router-link
            v-if="isLoaded"
            to="/"
          >
            <span>
              All polls
            </span>
          </router-link>
          <skeleton-loader
            v-else
            template="smallString"
          />
          <router-link
            v-if="isLoaded"
            to="/"
          >
            <span>
              My polls
            </span>
          </router-link>
          <!-- eslint-disable max-len -->
          <router-link
            v-if="getModule().canRenderSubmodule(PollRequestsModule)"
            :to="vueRoutes.pollsRequests"
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
  </div>
</template>

<script>
import TopBar from '@/vue/common/TopBar'
import SkeletonLoader from '@/vue/common/skeleton-loader/SkeletonLoader'
import { PollRequestsModule } from '@/vue/modules/requests/poll-requests/module'
import { vueRoutes } from '@/vue-router/routes'

const EVENTS = {
  reloadpollsData: 'reload-polls-data',
}

export default {
  name: 'polls-top-bar',
  components: {
    TopBar,
    SkeletonLoader,
  },
  data: () => ({
    isLoaded: true,
    PollRequestsModule,
    vueRoutes,
  }),
  methods: {
    closeBuyOfferDrawer () {
      this.$emit(EVENTS.reloadpollsData)
    },
    closeSellOfferDrawer () {
      this.$emit(EVENTS.reloadpollsData)
    },
  },
}
</script>

<style lang="scss">
  @import '~@scss/mixins';
  @import '~@scss/variables';

  $media-custom-breakpoint: 450px;

  .polls-asset-selector__balances-skeleton-loader--margin {
    margin-top: 0.8rem;
  }

  .polls-asset-selector__field {
    display: inline-block;
    width: auto;
  }

  .polls-asset-selector__balances {
    margin-top: 2.4rem;
  }

  .polls-asset-selector__balances-value {
    font-size: 2.8rem;
    font-weight: 400;

    @include respond-to-custom ($media-custom-breakpoint) {
      font-size: 2.2rem;
    }
  }

  .polls-asset-selector__balances-label {
    font-size: 1.6rem;
    color: $col-text-secondary;

    @include respond-to-custom ($media-custom-breakpoint) {
      font-size: 1.4rem;
    }
  }
</style>
