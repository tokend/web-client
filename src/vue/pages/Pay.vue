<template>
  <div class="pay">
    <div class="pay__top-bar">
      <div class="pay__headers">
        <h1 class="pay__top-bar-title">
          {{ 'pay-page.pay-title' | globalize }}
        </h1>
        <h3>
          {{ 'pay-page.buy-sum-assets' | globalize }}
        </h3>
      </div>
      <div class="pay__right-side">
        <img class="pay__logo" src="/static/conto-logo.png">
      </div>
    </div>
    <div class="pay__description">
      <div class="pay__asset-information">
        Asset info
      </div>
      <pay-form class="pay__form" />
    </div>
  </div>
</template>

<script>
import PayForm from '@/vue/forms/PayForm'
import { api } from '@/api'
import { AtomicSwapRecord } from '@/js/records/entities/atomic-swap.record'
import { ErrorHandler } from '@/js/helpers/error-handler'

export default {
  name: 'pay',
  components: { PayForm },

  data () {
    return {
      atomicSwapAsk: {},
      isLoaded: false,
    }
  },

  async created () {
    try {
      await this.getAtomicSwapAsk(this.$route.query.id)
      this.isLoaded = true
    } catch (e) {
      ErrorHandler.processWithoutFeedback()
    }
  },

  methods: {
    async getAtomicSwapAsk (id) {
      const { data } = await api.get(`/v3/atomic_swap_asks/${id}`, {
        include: ['owner', 'base_asset', 'quote_assets'],
      })
      this.atomicSwapAsk = new AtomicSwapRecord(data)
    },
  },
}
</script>

<style lang="scss" scoped>
  @import '~@/vue/forms/app-form';
  $pading: 2.4rem;

  .pay {
    padding: 3.5rem 15%;
  }

  .pay__top-bar {
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding-left: $pading;
    padding-right: $pading;
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
    margin-top: 4rem;
    background-color: $col-block-bg;
    padding: $pading;
    display: flex;

    @include box-shadow();
  }

  .pay__logo {
    margin-top: 1rem;
    max-height: 4.5rem;
    height: inherit;
    width: inherit;
  }

  .pay__form,
  .pay__asset-information {
    width: 50%;
  }
</style>
