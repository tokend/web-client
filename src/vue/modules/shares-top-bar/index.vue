<template>
  <div>
    <top-bar>
      <template v-if="isInitialized && assets.length">
        <div
          slot="main"
          class="shared-top-bar__filters"
        >
          <span class="shared-top-bar__filters-prefix">
            {{ 'op-pages.filters-prefix' | globalize }}
          </span>
          <select-field
            v-model="asset"
            :values="assets"
            key-as-value-text="nameAndCode"
            class="app__select app__select--no-border"
          />
        </div>
      </template>
    </top-bar>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { types } from './store/types'

import TopBar from '@/vue/common/TopBar'
import SelectField from '@/vue/fields/SelectField'

const EVENTS = {
  assetUpdated: 'asset-updated',
  movementsUpdateRequired: 'movements-update-required',
}

export default {
  name: 'shares-top-bar',
  components: {
    SelectField,
    TopBar,
  },
  data: _ => ({
    isInitialized: false,
    asset: {},
    EVENTS,
  }),
  computed: {
    ...mapGetters('shares-top-bar', {
      balances: types.balances,
      assets: types.assets,
    }),
  },
  watch: {
    asset: {
      deep: true,
      handler (value) {
        this.$router.push({
          query: { asset: value.code },
        })
        this.$emit(EVENTS.assetUpdated, value)
      },
    },
  },
  async created () {
    await this.loadBalances()
    await this.loadAssets()
    this.setDefaultAsset()
    this.isInitialized = true
  },
  methods: {
    ...mapActions('shares-top-bar', {
      loadBalances: types.LOAD_BALANCES,
      loadAssets: types.LOAD_ASSETS,
    }),
    setDefaultAsset () {
      this.asset = this.assets
        .find(item => item.code === this.$route.query.asset) ||
        this.assets[0]
    },
  },
}
</script>

<style lang="scss">
@import '~@scss/variables';
@import '~@scss/mixins';

.shared-top-bar__filters {
  display: inline-flex;
  align-items: center;
}

.shared-top-bar__filters-prefix {
  margin-right: 1.5rem;
  line-height: 1;
}
</style>
