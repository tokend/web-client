<template>
  <div
    class="balance-viewer__balances-wrp--direction-column"
  >
    <span class="balance-viewer__balances-label">
      {{ 'passport.balances' | globalize }}
    </span>
    <span
      v-for="(item, index) in baseAssets"
      :key="index"
    >
      {{ { value: item.balance, currency: item.asset } | formatMoney }}
    </span>
    <router-link
      class="balance-viewer__balances-link"
      :to="vueRoutes.balances"
      @click.native="showMoreBalances"
    >
      {{ 'passport.show-more' | globalize }}
    </router-link>
  </div>
</template>

<script>
import { vuexTypes } from '@/vuex'
import { mapGetters, mapActions } from 'vuex'
import { vueRoutes } from '@/vue-router/routes'
import { ASSET_POLICIES } from '@tokend/js-sdk'

export default {
  name: 'balance-viewer',
  data: () => ({
    vueRoutes,
    assetsPerPage: 3,
  }),
  computed: {
    ...mapGetters({
      accountBalances: vuexTypes.accountBalances,
    }),
    baseAssets () {
      return this.accountBalances
        .filter(asset => {
          return asset.assetDetails.policies.includes(ASSET_POLICIES.baseAsset)
        }).slice(0, this.assetsPerPage)
    },
  },
  async created () {
    await this.loadBalances()
  },
  methods: {
    ...mapActions({
      loadBalances: vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS,
    }),
    showMoreBalances () {
      this.$emit('show-more')
    },
  },
}
</script>

<style scoped lang="scss">
@import '~@scss/variables';
@import '~@scss/mixins';

$media-hide-account-details-bp: 800px;
$dropdown-item-side-padding: 2.4rem;

.balance-viewer__balances-wrp--direction-column {
  display: flex;
  flex-direction: column;
}

.passport__account-details-wrp {
  margin-left: 1.6rem;

  @include respond-to-custom($media-hide-account-details-bp) {
    display: none;
  }
}

.balance-viewer__balances-label {
  font-weight: 700;
  font-size: 1.2rem;
}

.balance-viewer__balances-link {
  font-size: 1.2rem;
  cursor: pointer;
  color: $col-link;
}
</style>
