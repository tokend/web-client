<template>
  <div class="issuance-explorer">
    <template>
      <issuances-table
        :issuances="issuances"
        :is-loaded="isLoaded"
      />
    </template>

    <template v-if="isLoadFailed">
      <p class="issuance-explorer__error-msg">
        {{ 'issuance-explorer.load-failed-msg' | globalize }}
      </p>
    </template>

    <div class="issuance-explorer__collection-loader-wrp">
      <collection-loader
        v-show="isLoaded"
        :first-page-loader="firstPageLoader"
        @first-page-load="setIssuances"
        @next-page-load="concatIssuances"
      />
    </div>
  </div>
</template>

<script>
import CollectionLoader from '@/vue/common/CollectionLoader'

import IssuancesTable from './components/issuances-table'

import { mapActions, mapMutations, mapGetters } from 'vuex'
import { types } from './store/types'

import { ErrorHandler } from '@/js/helpers/error-handler'

const EVENTS = {
  shouldUpdate: 'update:shouldUpdate',
}

export default {
  name: 'issuance-explorer-module',
  components: {
    IssuancesTable,
    CollectionLoader,
  },

  props: {
    shouldUpdate: {
      type: Boolean,
      default: false,
    },
  },

  data: _ => ({
    isLoaded: false,
    isLoadFailed: false,
    firstPageLoader: _ => {},
  }),

  computed: {
    ...mapGetters('issuance-explorer', {
      issuances: types.issuances,
    }),
  },

  watch: {
    shouldUpdate: function (value) {
      if (value) {
        this.initFirstPageLoader()
        this.$emit(EVENTS.shouldUpdate, false)
      }
    },
  },

  created () {
    this.initFirstPageLoader()
  },
  methods: {
    ...mapMutations('issuance-explorer', {
      setIssuances: types.SET_ISSUANCES,
      concatIssuances: types.CONCAT_ISSUANCES,
    }),
    ...mapActions('issuance-explorer', {
      loadIssuances: types.LOAD_ISSUANCES,
    }),

    initFirstPageLoader () {
      this.firstPageLoader = _ => this.loadIssuancesFirstPage()
    },

    async loadIssuancesFirstPage () {
      this.isLoaded = false
      try {
        const response = await this.loadIssuances()
        this.isLoaded = true
        return response
      } catch (e) {
        this.isLoadFailed = true
        ErrorHandler.processWithoutFeedback(e)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.issuance-explorer__collection-loader-wrp {
  margin-top: 1rem;
}
</style>
