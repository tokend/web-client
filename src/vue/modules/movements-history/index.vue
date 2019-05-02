<template>
  <div class="movements-history">
    <template v-if="isInitialized && assetCode">
      <template v-if="isMovementsLoaded">
        <div class="movements-history__list-wrp">
          <movements-table :movements="movements" />
        </div>
      </template>
      <template v-else-if="isMovementsLoadFailed">
        <p class="movements-history__error-msg">
          {{ 'movements-history.movements-load-failed-msg' | globalize }}
        </p>
      </template>
      <template v-else>
        <load-spinner message-id="movements-history.loading-movements-msg" />
      </template>

      <div class="movements-history__collection-loader-wrp">
        <collection-loader
          v-if="!isMovementsLoadFailed"
          v-show="isMovementsLoaded"
          :first-page-loader="firstPageLoader"
          @first-page-load="setMovements"
          @next-page-load="concatMovements"
          :ref="REFS.collectionLoader"
        />
      </div>
    </template>

    <template v-else>
      <load-spinner message-id="movements-history.initializing-msg" />
    </template>
  </div>
</template>

<script>
import CollectionLoader from '@/vue/common/CollectionLoader'
import MovementsTable from './components/movements-table'
import LoadSpinner from '@/vue/common/Loader'

import { mapActions, mapMutations, mapGetters } from 'vuex'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { types } from './store/types'

const REFS = {
  collectionLoader: 'collection-loader',
}

export default {
  name: 'movements-history-module',
  components: {
    LoadSpinner,
    MovementsTable,
    CollectionLoader,
  },
  props: {
    assetCode: {
      type: String,
      default: '',
    },
  },
  data: _ => ({
    isInitialized: false,
    isMovementsLoaded: false,
    isMovementsLoadFailed: false,
    REFS,
  }),
  computed: {
    ...mapGetters('movements-history', {
      balances: types.balances,
      movements: types.movements,
    }),
    firstPageLoader () {
      const assetCode = this.assetCode // HACK: passing this.assetCode directly
      // to function will lead to losing reactivity

      return _ => this.loadMovementsFirstPage(assetCode)
    },
  },
  async created () {
    await this.loadBalances()
    this.isInitialized = true
  },
  methods: {
    ...mapMutations('movements-history', {
      setMovements: types.SET_MOVEMENTS,
      concatMovements: types.CONCAT_MOVEMENTS,
    }),
    ...mapActions('movements-history', {
      loadMovements: types.LOAD_MOVEMENTS,
      loadBalances: types.LOAD_BALANCES,
    }),

    reloadCollectionLoader () {
      return this.$refs[REFS.collectionLoader].loadFirstPage()
    },

    async loadMovementsFirstPage (assetCode) {
      this.isMovementsLoaded = false
      try {
        const response = await this.loadMovements(assetCode)
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
