<template>
  <div class="pay">
    <div class="pay__top-bar">
      <div class="pay__headers">
        <h1 class="pay__top-bar-title">
          Pay
        </h1>
        <h3>
          Buy sum tokens
        </h3>
      </div>
      <div class="pay__right-side">
        <img class="pay__logo" src="/static/conto-logo.png">
      </div>
    </div>
    <div class="pay-form">
      <pay-form />
    </div>
  </div>
</template>

<script>
import PayForm from './pay/pay-form'
import { api } from '@/api'
import { AtomicSwapRecord } from '@/js/records/entities/atomic-swap.record'
export default {
  name: 'pay',
  components: { PayForm },
  mixins: [],
  props: {
  },
  data () {
    return {}
  },
  computed: {},
  watch: {},
  async created () {
    await this.getAtomicSwapAsk(this.$route.query.id)
  },
  destroyed () {
  },
  methods: {
    async getAtomicSwapAsk (id) {
      const { data } = await api.get(`/v3/atomic_swap_asks/${id}`, {
        include: ['owner', 'base_asset', 'quote_assets'],
      })
      return new AtomicSwapRecord(data)
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

  .pay-form {
    margin-top: 4rem;
    background-color: $col-block-bg;
    padding: $pading;

    @include box-shadow();
  }

  .pay__logo {
    margin-top: 1rem;
    max-height: 4.5rem;
    height: inherit;
    width: inherit;
  }
</style>
