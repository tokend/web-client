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
import FeesTable from '@/vue/pages/fees-all/FeesTable'
import { mapActions, mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import { ErrorHandler } from '@/js/helpers/error-handler'

export default {
  name: 'fees',
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
    ...mapGetters({
      fees: vuexTypes.fees,
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
    ...mapActions({
      loadAccountFees: vuexTypes.LOAD_ACCOUNT_FEES,
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
