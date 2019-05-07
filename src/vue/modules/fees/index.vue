<template>
  <div class="fees">
    <template v-if="assetCode">
      <template v-if="isLoaded">
        <fees-table :fees="valuableFeesByAssetCode" :asset-code="assetCode" />
      </template>

      <template v-else-if="isLoadFailed">
        <p class="fees__error-msg">
          {{ 'fees.fees-loading-error-msg' | globalize }}
        </p>
      </template>

      <template v-else>
        <load-spinner message-id="fees.fees-loading-msg" />
      </template>
    </template>
  </div>
</template>

<script>
import FeesTable from './components/fees-table'
import LoadSpinner from '@/vue/common/Loader'

import { mapActions, mapGetters } from 'vuex'
import { types } from './store/types'
import { ErrorHandler } from '@/js/helpers/error-handler'

export default {
  name: 'fees-module',
  components: {
    LoadSpinner,
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
