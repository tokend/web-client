<template>
  <div class="user-movements-history">
    <template v-if="assets.length">
      <div class="user-movements-history__select">
        <select-field
          :value="assetCode"
          @input="setAsset"
          class="app__select"
        >
          <option
            v-for="asset in assets"
            :key="asset"
            :value="asset"
          >
            {{ assetByCode(asset).name }}
          </option>
        </select-field>
      </div>
      <template>
        <movements-table
          :is-movements-loaded="isMovementsLoaded"
          :movements="movements"
        />

        <div class="user-movements-history__collection-loader-wrp">
          <collection-loader
            v-if="!isMovementsLoadFailed && assetCode"
            v-show="isMovementsLoaded"
            :first-page-loader="firstPageLoader"
            @first-page-load="setMovements"
            @next-page-load="concatMovements"
            :ref="REFS.collectionLoader"
          />
        </div>
      </template>
    </template>
  </div>
</template>

<script>
import CollectionLoader from '@/vue/common/CollectionLoader'
import MovementsTable from './components/user-movements-table'
import SelectField from '@/vue/fields/SelectField'

import { mapActions, mapMutations, mapGetters } from 'vuex'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { types } from './store/types'
import { vuexTypes } from '@/vuex'
import { CustomerRecord } from '@/vue/pages/customers-list/customer.record'

const REFS = {
  collectionLoader: 'collection-loader',
}

export default {
  name: 'user-movements-history-module',
  components: {
    MovementsTable,
    CollectionLoader,
    SelectField,
  },
  props: {
    customer: {
      type: CustomerRecord,
      required: true,
    },
  },
  data: _ => ({
    assetCode: '',
    isMovementsLoaded: false,
    isMovementsLoadFailed: false,
    REFS,
  }),

  computed: {
    ...mapGetters([
      vuexTypes.assetByCode,
    ]),
    ...mapGetters('user-movements-history', {
      movements: types.movements,
    }),
    firstPageLoader () {
      const assetCode = this.assetCode
      const accountId = this.customer.accountId
      // HACK: passing this.assetCode directly
      // to function will lead to losing reactivity

      return _ => this.loadMovementsFirstPage({ assetCode, accountId })
    },
    assets () {
      return this.customer.balances.map(item => item.assetCode)
    },
  },

  created () {
    this.assetCode = this.assets[0]
  },

  methods: {
    ...mapMutations('user-movements-history', {
      setMovements: types.SET_MOVEMENTS,
      concatMovements: types.CONCAT_MOVEMENTS,
    }),
    ...mapActions('user-movements-history', {
      loadMovements: types.LOAD_MOVEMENTS,
    }),

    reloadCollectionLoader () {
      return this.$refs[REFS.collectionLoader].loadFirstPage()
    },

    async loadMovementsFirstPage (assetCode, accountId) {
      this.isMovementsLoaded = false
      try {
        const response = await this.loadMovements(assetCode, accountId)
        this.isMovementsLoaded = true
        return response
      } catch (e) {
        ErrorHandler.processWithoutFeedback(e)
        this.isMovementsLoadFailed = true
      }
    },
    setAsset (value) {
      this.assetCode = value
    },
  },
}
</script>

<style lang="scss" scoped>
.user-movements-history__list-wrp {
  overflow-x: auto;
  width: 100%;
}

.user-movements-history__select {
  margin-top: 2rem;
  margin-bottom: 1.5rem;
  padding: 0 1.6rem;
}
</style>
