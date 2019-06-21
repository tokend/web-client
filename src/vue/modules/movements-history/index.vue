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
          @click="collection.loadPage()"
        >
          {{ 'common.more-btn' | globalize }}
        </button>
      </div>
    </template>
  </div>
</template>

<script>
import MovementsTable from './components/movements-table'
import Movement from './wrappers/movement'

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
      collection: new Collection(_ => {
        const balance = this.accountBalanceByCode(this.assetCode)
        if (this.isSharesPage) {
          return api.getWithSignature('/v3/history', {
            page: {
              order: 'desc',
              limit: 10,
            },
            filter: {
              asset: this.assetCode
            },
            include: ['effect', 'operation.details'],
          })
        } else {
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
    ...mapGetters({
      accountId: vuexTypes.accountId,
      accountBalanceByCode: vuexTypes.accountBalanceByCode,
    }),
    movements () {
      return this.collection.list.map(m => new Movement(m))
    },
    isSharesPage () {
      return this.$route.name === vueRoutes.registerOfShares.name
    },
  },

  watch: {
    async assetCode () {
      this.collection.reload()
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
