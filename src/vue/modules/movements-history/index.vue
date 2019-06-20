<template>
  <div class="movements-history">
    <template>
      <template>
        <h2 class="app__table-title" v-if="latestActivity">
          {{ 'movements-history.latest-activity' | globalize }}
        </h2>
        <div class="movements-history__list-wrp">
          <movements-table
            :is-movements-loaded="!collection.isLoading"
            :movements="movements"
          />
        </div>
      </template>
      <template v-if="collection.isFailed">
        <p class="movements-history__error-msg">
          {{ 'movements-history.movements-load-failed-msg' | globalize }}
        </p>
      </template>

      <div class="movements-history__collection-loader-wrp">
        <button
          v-show="!collection.isNoMoreEntries"
          class="collection__more-button app__button-flat"
          @click="loadCollection"
        >
          {{ 'common.more-btn' | globalize }}
        </button>
      </div>
    </template>
  </div>
</template>

<script>
import MovementsTable from './components/movements-table'

// import { mapActions, mapMutations, mapGetters } from 'vuex'
// import { types } from './store/types'
import { vueRoutes } from '@/vue-router/routes'
import { Collection } from '@/vue/common/collection.js'
import { api } from '@/api'
import { vuexTypes } from '@/vuex'
import { mapGetters } from 'vuex'

export default {
  name: 'movements-history-module',

  components: {
    MovementsTable,
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

  data () {
    return ({
      movements: [],
      collection: new Collection(() => {
        if (this.isSharesPage) {
          return this.loadShareMovements(this.assetCode)
        } else {
          // return this.loadMovements(this.assetCode)
          const balance = this.accountBalanceByCode(this.assetCode)
          return api.getWithSignature('/v3/history', {
            page: {
              order: 'desc',
              limit: 10,
            },
            filter: {
              account: this.accountId,
              balance: balance.id,
            },
            include: ['effect', 'operation.details'],
          })
        }
      }),
    })
  },

  computed: {
    // ...mapGetters('movements-history', {
    //   movements: types.movements,
    // }),
    // firstPageLoader () {
    //   const assetCode = this.assetCode
    // HACK: passing this.assetCode directly
    //   // to function will lead to losing reactivity

    //   return _ => this.loadMovementsFirstPage(assetCode)
    // },
    ...mapGetters({
      accountId: vuexTypes.accountId,
      accountBalanceByCode: vuexTypes.accountBalanceByCode,
    }),
    isSharesPage () {
      return this.$route.name === vueRoutes.registerOfShares.name
    },
  },

  watch: {
    async assetCode () {
      // this.collection.setLoader = this.firstPageLoader
      this.movements = await this.collection.reload()
      // this.reloadCollectionLoader()
    },
  },

  methods: {
    // ...mapMutations('movements-history', {
    //   setMovements: types.SET_MOVEMENTS,
    // }),
    // ...mapActions('movements-history', {
    //   loadMovements: types.LOAD_MOVEMENTS,
    //   loadShareMovements: types.LOAD_SHARE_MOVEMENTS,
    // }),

    async loadMovementsFirstPage (assetCode) {
      let response
      if (this.isSharesPage) {
        response = await this.loadShareMovements(assetCode)
      } else {
        response = await this.loadMovements(assetCode)
      }
      return response
    },
    async loadCollection () {
      this.movements = await this.collection.loadPage()
    },
  },
}
// удалить стор мувмента, но проверить нигде ли он больше
//  не используеться ------------------------------------
</script>

<style lang="scss" scoped>
.movements-history__list-wrp {
  overflow-x: auto;
  width: 100%;
}
</style>
