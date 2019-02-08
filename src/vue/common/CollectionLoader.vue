<template>
  <div class="collection-loader">
    <button
      v-if="!isCollectionFetched"
      class="collection-loader__more-button"
      @click="loadNextPage">
      {{ 'common.more-btn' | globalize }}
    </button>
  </div>
</template>

<script>
/**
 * CollectionLoader is responsible for downloading pageable collections.
 * After loading emits the event ('first-page-load'
 * - when loaded first page and 'next-page-load' - when load next page)
 * with the loaded data and decide whether or not it should still show itself.
 *
 * @prop {Function} firstPageLoader - function for downloading first page of
 * data
 * @prop {Function} pageLimit - the maximum quantity of records per page
 *
 * Example:
 *
 * <collection-loader
 *    :first-page-loader="Sdk.horizon.transactions.getAll"
 *    :page-limit="10"
 *    @first-page-load="onFirstPageLoad"/>
 *    @next-page-load="onNextPageLoad"
 * />
**/
import { ErrorHandler } from '@/js/helpers/error-handler'

const EVENTS = {
  firstPageLoad: 'first-page-load',
  nextPageLoad: 'next-page-load',
  error: 'error',
}
const DEFAULT_PAGE_LIMIT = 10

export default {
  name: 'collection-loader',
  props: {
    firstPageLoader: {
      type: Function,
      required: true,
    },
    pageLimit: {
      type: Number,
      default: DEFAULT_PAGE_LIMIT,
    },
  },
  data: _ => ({
    nextPageLoader: () => {},
    isCollectionFetched: false,
  }),
  watch: {
    firstPageLoader: {
      immediate: true,
      handler: 'loadFirstPage',
    },
  },
  methods: {
    loadFirstPage () {
      this.loadPage(EVENTS.firstPageLoad, this.firstPageLoader)
    },
    loadNextPage () {
      this.loadPage(EVENTS.nextPageLoad, this.nextPageLoader)
    },
    async loadPage (eventName, loaderFn) {
      try {
        const response = await loaderFn()
        this.$emit(eventName, response.data)
        this.nextPageLoader = response.fetchNext
        this.isCollectionFetched =
          response.data.length < this.pageLimit
      } catch (e) {
        this.$emit(EVENTS.error, e)
        ErrorHandler.processWithoutFeedback(e)
      }
    },
  },
}
</script>

<style lang="scss">
  @import '~@scss/variables';
  @import '~@scss/mixins';

  .collection-loader {
    display: flex;
    justify-content: center;
  }

  .collection-loader__more-button {
    @include button-flat();
  }
</style>
