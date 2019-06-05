<template>
  <div class="fees">
    <template v-if="assetCode">
      <template>
        <fees-table
          :fees="valuableFeesByAssetCode"
          :asset-code="assetCode"
          :is-loaded="isLoaded"
        />
      </template>

      <template v-if="isLoadFailed">
        <p class="fees__error-msg">
          {{ 'fees.fees-loading-error-msg' | globalize }}
        </p>
      </template>
    </template>
  </div>
</template>

<script>
import FeesTable from './components/fees-table'

import { mapActions, mapGetters } from 'vuex'
import { types } from './store/types'
import { ErrorHandler } from '@/js/helpers/error-handler'

export default {
  name: 'fees-module',
  components: {
    FeesTable,
  },
  props: {
    assetCode: {
      type: String,
      default: '',
    },
  },

  data: _ => ({
    isLoaded: false,
    isLoadFailed: false,
  }),

  computed: {
    ...mapGetters('fees', {
      fees: types.fees,
    }),

    valuableFeesByAssetCode () {
      return this.fees.filter(item => {
        return item.asset === this.assetCode &&
          (Number(item.fixed) || Number(item.percent))
      })
    },
  },

  async created () {
    await this.loadFees()
  },
  methods: {
    ...mapActions('fees', {
      loadAccountFees: types.LOAD_ACCOUNT_FEES,
    }),

    async loadFees () {
      try {
        await this.loadAccountFees()
        this.isLoaded = true
      } catch (e) {
        this.isLoadFailed = true
        ErrorHandler.processWithoutFeedback(e)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.fees__collection-loader-wrp {
  margin-top: 1rem;
}
</style>
