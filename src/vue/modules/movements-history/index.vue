<template>
  <div class="movements-history">
    <template>
      <template>
        <h2 class="app__table-title" v-if="latestActivity">
          {{ 'movements-history.latest-activity' | globalize }}
        </h2>
        <div class="movements-history__list-wrp">
          <movements-table
            :is-movements-loaded="isMovementsLoaded"
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
        <collection-loader
          v-if="!isMovementsLoadFailed && assetCode"
          v-show="isMovementsLoaded && !latestActivity"
          :first-page-loader="firstPageLoader"
          @first-page-load="setMovements"
          @next-page-load="concatMovements"
          :ref="REFS.collectionLoader"
        />
      </div>
    </template>
  </div>
</template>

<script>
import CollectionLoader from '@/vue/common/CollectionLoader'
import MovementsTable from './components/movements-table'

import { mapActions, mapMutations, mapGetters } from 'vuex'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { types } from './store/types'
import { vueRoutes } from '@/vue-router/routes'

const REFS = {
  collectionLoader: 'collection-loader',
}

export default {
  name: 'movements-history-module',
  components: {
    MovementsTable,
    CollectionLoader,
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
    isMovementsLoaded: false,
    isMovementsLoadFailed: false,
    REFS,
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

  methods: {
    ...mapMutations('movements-history', {
      setMovements: types.SET_MOVEMENTS,
      concatMovements: types.CONCAT_MOVEMENTS,
    }),
    ...mapActions('movements-history', {
      loadMovements: types.LOAD_MOVEMENTS,
      loadShareMovements: types.LOAD_SHARE_MOVEMENTS,
    }),

    reloadCollectionLoader () {
      return this.$refs[REFS.collectionLoader].loadFirstPage()
    },

    async loadMovementsFirstPage (assetCode) {
      this.isMovementsLoaded = false
      try {
        let response
        if (this.isSharesPage) {
          response = await this.loadShareMovements(assetCode)
        } else {
          response = await this.loadMovements(assetCode)
        }
        this.isMovementsLoaded = true
        return response
      } catch (e) {
        ErrorHandler.processWithoutFeedback(e)
        this.isMovementsLoadFailed = true
      }
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
