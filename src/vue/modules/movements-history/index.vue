<template>
  <div class="movements-history">
    <template>
      <template>
        <h2 class="app__table-title" v-if="latestActivity">
          {{ 'movements-history.latest-activity' | globalize }}
        </h2>
        <div class="movements-history__list-wrp">
          <movements-table
            :is-movements-loaded="isMovementsLoading"
            :movements="movements"
          />
        </div>
      </template>
      <template v-if="isMovementsLoadFailed">
        <p class="movements-history__error-msg">
          {{ 'movements-history.movements-load-failed-msg' | globalize }}
        </p>
      </template>

      <div class="movements-history__collection-loader-wrp">
        <collection
          v-if="!isMovementsLoadFailed && assetCode"
          v-show="!isMovementsLoading && !latestActivity"
          @is-loading="isMovementsLoading"
          @is-failed="isMovementsLoadFailed"
          :loader="firstPageLoader"
          v-model="list"
          ref="collection"
        />
      </div>
    </template>
  </div>
</template>

<script>
import Collection from '@/vue/common/Collection'
import MovementsTable from './components/movements-table'

import { mapActions, mapMutations, mapGetters } from 'vuex'
import { types } from './store/types'
import { vueRoutes } from '@/vue-router/routes'

const REFS = {
  collection: 'collection',
}

export default {
  name: 'movements-history-module',
  components: {
    MovementsTable,
    Collection,
  },
  props: {
    assetCode: {
      type: String,
      default: '',
    },
    latestActivity: {
      type: Boolean,
      default: false,
    },
  },
  data: _ => ({
    isMovementsLoading: false,
    isMovementsLoadFailed: false,
    REFS,
    list: [],
  }),
  computed: {
    ...mapGetters('movements-history', {
      movements: types.movements,
    }),
    firstPageLoader () {
      const assetCode = this.assetCode // HACK: passing this.assetCode directly
      // to function will lead to losing reactivity

      return _ => this.loadMovementsFirstPage(assetCode)
    },

    isSharesPage () {
      return this.$route.name === vueRoutes.registerOfShares.name
    },
  },
  watch: {
    list (value) {
      this.setMovements(value)
    },
    assetCode (value) {
      this.reloadCollectionLoader()
    },
  },
  methods: {
    ...mapMutations('movements-history', {
      setMovements: types.SET_MOVEMENTS,
    }),
    ...mapActions('movements-history', {
      loadMovements: types.LOAD_MOVEMENTS,
      loadShareMovements: types.LOAD_SHARE_MOVEMENTS,
    }),

    reloadCollectionLoader () {
      return this.$refs[REFS.collection].reload()
    },

    async loadMovementsFirstPage (assetCode) {
      let response
      if (this.isSharesPage) {
        response = await this.loadShareMovements(assetCode)
      } else {
        response = await this.loadMovements(assetCode)
      }
      return response
    },
  },
}
</script>

<style lang="scss" scoped>
.movements-history__list-wrp {
  overflow-x: auto;
  width: 100%;
}
</style>
