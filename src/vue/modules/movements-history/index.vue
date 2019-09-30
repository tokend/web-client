<template>
  <div class="movements-history">
    <div class="movements-history__list-wrp">
      <movements-table
        :is-movements-loaded="isMovementsLoaded"
        :movements="movements"
        :is-customer-movements="isCustomerMovements"
      />
    </div>

    <template v-if="isMovementsLoadFailed">
      <p class="movements-history__error-msg">
        {{ 'movements-history.movements-load-failed-msg' | globalize }}
      </p>
    </template>

    <div class="movements-history__collection-loader-wrp">
      <collection-loader
        v-if="!isMovementsLoadFailed && (assetCode || isCustomerMovements)"
        v-show="isMovementsLoaded"
        :first-page-loader="firstPageLoader"
        @first-page-load="setMovements"
        @next-page-load="concatMovements"
        :ref="REFS.collectionLoader"
      />
    </div>
  </div>
</template>

<script>
import CollectionLoader from '@/vue/common/CollectionLoader'
import MovementsTable from './components/movements-table'

import { mapActions, mapMutations, mapGetters } from 'vuex'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { vuexTypes } from '@/vuex'
import { CustomerRecord } from '@/js/records/entities/customer.record'

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
    customer: {
      type: CustomerRecord,
      default: null,
    },
  },
  data: _ => ({
    isMovementsLoaded: false,
    isMovementsLoadFailed: false,
    REFS,
  }),

  computed: {
    ...mapGetters({
      movements: vuexTypes.movements,
      isBusinessToBrowse: vuexTypes.isBusinessToBrowse,
    }),

    isCustomerMovements () {
      return Boolean(this.customer)
    },

    firstPageLoader () {
      // HACK: passing this.assetCode and this.customer.accountId directly
      // to function will lead to losing reactivity
      const assetCode = this.assetCode
      let accountId = ''

      if (this.isCustomerMovements) {
        accountId = this.customer.accountId
      }

      return _ => this.loadMovementsFirstPage(assetCode, accountId)
    },
  },

  created () {
    // HACK: fix display of no-data-message if no assetCode can be get. To
    // prevent infinite display of skeleton screen
    setTimeout(() => {
      if (!this.assetCode) {
        this.isMovementsLoaded = true
      }
    }, 1000)
  },

  methods: {
    ...mapMutations({
      setMovements: vuexTypes.SET_MOVEMENTS,
      concatMovements: vuexTypes.CONCAT_MOVEMENTS,
    }),
    ...mapActions({
      loadMovements: vuexTypes.LOAD_MOVEMENTS,
      loadShareMovements: vuexTypes.LOAD_SHARE_MOVEMENTS,
    }),

    async loadMovementsFirstPage (assetCode, accountId) {
      this.isMovementsLoaded = false
      try {
        let response
        if (this.isBusinessToBrowse || this.isCustomerMovements) {
          response = await this.loadMovements({ assetCode, accountId })
        } else {
          response = await this.loadShareMovements(assetCode)
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
