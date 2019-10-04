<template>
  <div class="pay">
    <div class="pay__top-bar">
      <div class="pay__headers">
        <h1 class="pay__top-bar-title">
          {{ 'pay-page.pay-title' | globalize }}
        </h1>
      </div>
      <router-link
        class="pay__login-link"
        :to="vueRoutes.login"
      >
        <img class="pay__logo" src="/static/conto-logo.png">
      </router-link>
    </div>

    <template v-if="isLoaded && atomicSwapAsk.isCanceled">
      <no-data-message
        class="pay__no-data-message"
        icon-name="credit-card"
        :title="'pay-page.offer-canceled-title' | globalize"
        :message="'pay-page.offer-canceled-msg' | globalize"
      />
    </template>

    <template v-else-if="isLoaded && !atomicSwapAsk.isAmountMoreThanZero">
      <no-data-message
        class="pay__no-data-message"
        icon-name="credit-card"
        :title="'pay-page.no-amount-title' | globalize"
        :message="'pay-page.no-amount-msg' | globalize"
      />
    </template>

    <template v-else-if="isLoaded">
      <div class="pay__description">
        <asset-viewer
          class="pay__asset-viewer"
          :asset-code="atomicSwapAsk.baseAssetCode"
        />
        <pay-form
          :atomic-swap-ask="atomicSwapAsk"
          class="pay__form"
        />
      </div>
    </template>

    <template v-else-if="isLoading">
      <pay-skeleton />
    </template>

    <template v-else-if="isNotFoundAtomicSwap">
      <no-data-message
        class="pay__no-data-message"
        icon-name="credit-card"
        :title="'pay-page.no-atomic-swap-title' | globalize"
        :message="'pay-page.no-atomic-swap-msg' | globalize"
      />
    </template>

    <div class="pay__footer-section">
      <app-footer />
    </div>
  </div>
</template>

<script>
import PayForm from '@/vue/forms/PayForm'
import AppFooter from '@/vue/navigation/Footer'
import AssetViewer from './pay/AssetViewer'
import NoDataMessage from '@/vue/common/NoDataMessage'
import PaySkeleton from './pay/PaySkeleton'
import { api } from '@/api'
import { AtomicSwapAskRecord } from '@/js/records/entities/atomic-swap-ask.record'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { vueRoutes } from '@/vue-router/routes'

export default {
  name: 'pay',
  components: {
    PayForm,
    AppFooter,
    AssetViewer,
    NoDataMessage,
    PaySkeleton,
  },

  data () {
    return {
      atomicSwapAsk: {},
      isLoaded: false,
      isLoading: false,
      isNotFoundAtomicSwap: false,
      vueRoutes,
    }
  },

  async created () {
    this.isLoading = true
    try {
      await this.getAtomicSwapAsk(this.$route.query.id)
      this.isLoaded = true
    } catch (e) {
      this.isLoading = false
      this.isNotFoundAtomicSwap = true
      ErrorHandler.processWithoutFeedback()
    }
    this.isLoading = false
  },

  methods: {
    async getAtomicSwapAsk (id) {
      const { data } = await api.get(`/integrations/marketplace/offers/${id}`)
      this.atomicSwapAsk = new AtomicSwapAskRecord(data)
    },
  },
}
</script>

<style lang="scss">
  @import '~@/vue/forms/app-form';
  @import '~@scss/variables.scss';
  @import '~@scss/mixins.scss';

  $media-small-desktop: 960px;

  .pay {
    padding: 3.5rem 15%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 100vh;

    @include respond-to(xsmall) {
      padding: 3.5rem 2%;
    }
  }

  .pay__top-bar {
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding-left: 2.4rem;
    padding-right: 2.4rem;

    @include respond-to(xsmall) {
      padding-left: 2rem;
      padding-right: 2rem;
    }
  }

  .pay__top-bar-title {
    color: $col-text-page-heading;
    font-size: 4rem;
    line-height: 1.5;
    font-weight: 400;
    min-width: 15rem;

    @include respond-to-custom($sidebar-hide-bp) {
      font-size: 3.2rem;
    }
  }

  .pay__description {
    background-color: $col-block-bg;
    padding: 2.4rem;
    display: flex;
    justify-content: space-between;

    @include box-shadow();
    @include respond-to-custom($media-small-desktop) {
      flex-direction: column;
      margin: 4rem 0;
    }
  }

  .pay__logo {
    margin-top: 1rem;
    max-height: 4.5rem;
    height: inherit;
    width: inherit;
  }

  .pay__form {
    width: 50%;
    padding-left: 1.5%;

    @include respond-to-custom($media-small-desktop) {
      width: 100%;
      padding-left: 0;
    }
  }

  .pay__asset-viewer {
    width: 50%;
    padding-right: 1.5%;
    border-right: 0.2rem solid $col-border;

    @include respond-to-custom($media-small-desktop) {
      width: 100%;
      padding-right: 0;
      border-right: none;
      margin-bottom: 2rem;
    }
  }

  .pay__footer-section {
    padding: 0 1.6rem;
    width: 100%;
  }

  .pay__no-data-message {
    margin-top: -3.5rem;
  }
</style>
