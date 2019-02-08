<template>
  <div class="assets-explorer">
    <div class="assets-explorer__asset-list-wrp">
      <assets-list :assets="assets" />
    </div>
    <div class="assets-explorer__collection-loader-wrp">
      <collection-loader
        :first-page-loader="loadAssets"
        @first-page-load="setAssets"
        @next-page-load="setNextAssets"
      />
    </div>
  </div>
</template>

<script>
import AssetsList from './ListRenderer'
import CollectionLoader from '@/vue/common/CollectionLoader'

import { mapActions, mapMutations, mapGetters } from 'vuex'
import { types } from '../store/types'

export default {
  name: 'assets-explorer',
  components: {
    AssetsList,
    CollectionLoader,
  },
  computed: {
    ...mapGetters({
      assets: types.assets,
    }),
  },
  created () {
    this.loadBalances()
  },
  methods: {
    ...mapMutations({
      setAssets: types.SET_ASSETS,
      setNextAssets: types.SET_NEXT_ASSETS,
    }),
    ...mapActions({
      loadAssets: types.LOAD_ASSETS,
      loadBalances: types.LOAD_BALANCES,
    }),
  },
}
</script>
