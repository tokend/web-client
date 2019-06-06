<template>
  <div>
    <collection-loader
      class="create-asset-requests__loader"
      v-show="requests.length && isLoaded"
      :first-page-loader="firstPageLoader"
      @first-page-load="setRequests"
      @next-page-load="concatRequests"
    />
  </div>
</template>

<script>
import { ErrorHandler } from '@/js/helpers/error-handler'
import { mapActions, mapMutations, mapGetters } from 'vuex'
import { types } from './store/types'
import CollectionLoader from '@/vue/common/CollectionLoader'

export default {
  name: 'poll-requests',
  components: {
    CollectionLoader,
  },
  data: _ => ({
    isLoaded: false,
    firstPageLoader: () => {},
  }),
  computed: {
    ...mapGetters('poll-requests', {
      requests: types.requests,
    }),
  },
  async created () {
    this.initFirstPageLoader()
  },
  methods: {
    ...mapMutations('poll-requests', {
      setRequests: types.SET_REQUESTS,
      concatRequests: types.CONCAT_REQUESTS,
    }),
    ...mapActions('poll-requests', {
      loadCreateAssetRequests: types.LOAD_REQUESTS,
    }),
    async loadRequests () {
      this.isLoaded = false
      try {
        const response = await this.loadCreateAssetRequests()
        this.isLoaded = true
        return response
      } catch (e) {
        this.isLoadingFailed = true
        ErrorHandler.processWithoutFeedback(e)
      }
    },

    initFirstPageLoader () {
      this.firstPageLoader = _ => this.loadRequests()
    },
  },
}
</script>

<style scoped lang="scss"></style>
