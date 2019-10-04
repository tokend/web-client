<template>
  <div class="business">
    <div class="business__wrp">
      <div class="business__top-bar">
        <div class="business__name-wrp">
          <h1 class="business__title">
            {{ business.name }}
          </h1>
          <h3 v-if="business.industry">
            {{ business.industry }}
          </h3>
        </div>
        <router-link
          class="business__login-link"
          :to="vueRoutes.login"
        >
          <img class="business__logo" src="/static/conto-logo.png">
          <img class="business__small-logo" src="/static/favicon-conto.png">
        </router-link>
      </div>
      <template v-if="isLoaded">
        <div class="business__description app__card">
          <business-description
            :business="business"
          />
        </div>
      </template>
      <template v-else-if="!isLoaded && !isFailed">
        <loader
          :message-id="'business.loading-msg'"
        />
      </template>
      <template v-if="isFailed">
        <no-data-message
          icon-name="castle"
          :title="'business.error-title' | globalize"
          :message="'business.error-msg' | globalize"
        />
      </template>
      <template v-if="!isFailed">
        <div class="business__shop">
          <h1 class="business__title">
            {{ 'business.shop' | globalize }}
          </h1>
        </div>
        <atomic-swaps-explore
          :business-id="id"
        />
      </template>

      <div class="business__footer-section">
        <app-footer />
      </div>
    </div>
  </div>
</template>

<script>
import AppFooter from '@/vue/navigation/Footer'
import BusinessDescription from '@/vue/pages/business/BusinessDescription'
import AtomicSwapsExplore from '@/vue/pages/atomic-swaps/AtomicSwapsExplore'
import NoDataMessage from '@/vue/common/NoDataMessage'
import Loader from '@/vue/common/Loader'

import { vueRoutes } from '@/vue-router/routes'
import { api } from '@/api'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { BusinessRecord } from '@/js/records/entities/business.record'

export default {
  name: 'business',
  components: {
    AppFooter,
    BusinessDescription,
    AtomicSwapsExplore,
    Loader,
    NoDataMessage,
  },
  mixins: [],
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data () {
    return {
      vueRoutes,
      business: {},
      isLoaded: false,
      isFailed: false,
    }
  },
  computed: {},
  watch: {},
  async created () {
    this.getBusiness()
  },
  destroyed () {
  },
  methods: {
    async getBusiness () {
      try {
        this.isLoaded = false
        const endpoint = `/integrations/dns/businesses/${this.id}`
        const { data } = await api.get(endpoint)
        this.business = new BusinessRecord(data)
        this.isLoaded = true
      } catch (error) {
        ErrorHandler.processWithoutFeedback(error)
        this.isFailed = true
      }
    },
  },
}
</script>

<style lang="scss" scoped>
  @import '~@/vue/forms/app-form';
  @import '~@scss/variables.scss';
  @import '~@scss/mixins.scss';

  $full-screen-padding: 5%;
  $mobile-screen-padding: 2%;
  $full-logo-width: 13.65rem;
  $small-logo-width: 4.5rem;

  .business {
    width: 100%;
    display: flex;
    justify-content: center;
    min-height: 100vh;
  }

  .business__wrp {
    width: 100%;
    max-width: 150rem;
    padding: 3.5rem $full-screen-padding;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    @include respond-to(xsmall) {
      padding: 2rem $mobile-screen-padding;
    }
  }

  .business__top-bar {
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding-left: 2.4rem;
    padding-right: 2.4rem;
    margin-bottom: 2.4rem;

    @include respond-to(xsmall) {
      padding-left: 0;
      padding-right: 0;
    }
  }

  .business__logo {
    margin-top: 1rem;
    max-width: $full-logo-width;
    height: inherit;
    width: inherit;

    @include respond-to-custom($sidebar-hide-bp) {
      display: none;
    }
  }

  .business__small-logo {
    display: none;
    max-height: 4.5rem;
    height: inherit;
    width: inherit;

    @include respond-to-custom($sidebar-hide-bp) {
      display: block;
    }
  }

  .business__name-wrp {
    max-width: calc(100% - #{$full-logo-width});
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;

    @include respond-to-custom($sidebar-hide-bp) {
      max-width: calc(100% - #{$small-logo-width});
    }
  }

  .business__title {
    color: $col-text-page-heading;
    font-size: 3rem;
    line-height: 1.5;
    font-weight: 400;
    min-width: 15rem;

    @include respond-to-custom($sidebar-hide-bp) {
      font-size: 3.2rem;
    }
  }

  .business__description {
    padding: 2.4rem;
    margin-bottom: 2.4rem;
  }

  .business__shop {
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding-left: 2.4rem;
    padding-right: 2.4rem;
    margin-bottom: 0.4rem;

    @include respond-to(xsmall) {
      padding-left: 0;
      padding-right: 0;
    }
  }

  .business__footer-section {
    margin-top: 2.4rem;
    padding: 0 1.6rem;
    width: 100%;
  }
</style>
