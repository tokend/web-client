<template>
  <div class="collection-loader">
    <button
      v-if="!allDataLoaded"
      class="collection-loader__more-button"
      @click="loadNextPage">
      {{ 'common.button-text-more' | globalize }}
    </button>
  </div>
</template>

<script>
/**
 * CollectionLoader is responsible for downloading pageable collections
 * which there is a pagination. After loading emits the event ('first-page-load'
 * - when loaded first page and 'next-page-load' - when load next page)
 * with the loaded data and decide whether or not it still show
 * itself.
 *
 * @props {Function} firstPageLoader - function for downloading first page of
 * data
 *
 * Example:
 *
 * <collection-loader
 *    :first-page-loader="Sdk.horizon.transactions.getAll"
 *    @first-page-load="onFirstPageLoad"/>
 *    @next-page-load="handlerNextData"
 * />
**/
import config from '@/config'
import { ErrorHandler } from '@/js/helpers/error-handler'

const PAGINATION_EVENTS = {
  firstPageLoad: 'first-page-load',
  nextPageLoad: 'next-page-load'
}

export default {
  name: 'collection-loader',
  props: {
    firstPageLoader: {
      type: Function,
      required: true
    }
  },
  data: _ => ({
    nextPageLoader: null,
    allDataLoaded: false
  }),
  watch: {
    firstPageLoader: {
      immediate: true,
      handler: 'loadFirstPage'
    }
  },
  methods: {
    loadFirstPage () {
      this.loadPage(PAGINATION_EVENTS.firstPageLoad, this.firstPageLoader)
    },
    loadNextPage () {
      this.loadPage(PAGINATION_EVENTS.nextPageLoad, this.nextPageLoader)
    },
    async loadPage (eventName, loaderFn) {
      try {
        const response = await loaderFn()
        this.$emit(eventName, response.data)
        this.nextPageLoader = response.fetchNext
        this.allDataLoaded = !response.data ||
          response.data.length < config.REQUESTS_PER_PAGE
      } catch (e) {
        console.error(e)
        ErrorHandler.process(e)
      }
    }
  }
}
</script>

<style lang="scss">
  @import '../../scss/variables';
  @import '../../scss/mixins';

  .collection-loader__more-button {
    @include button-flat;
  }
</style>
