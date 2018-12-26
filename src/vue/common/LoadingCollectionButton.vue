<template>
  <div class="pagination">
    <button
      class="pagination__more-button"
      @click="getNextPage">
      {{ 'common.button-text-more' | globalize }}
    </button>
  </div>
</template>

<script>
/**
 * This component is responsible for downloading pageable collections
 * which there is a pagination. After loading emits the event (describe
 * what event) with the loaded data and decide whether or not it still show
 * itself.
 *
 * @props {Function} firstPageLoader - function for downloading first page of
 * data
 *
 * Example:
 *
 * <collection-renderer
 *    :first-page-loader="function() {Sdk.horizon.transaction.getAll()}"
 *    @load-first-page="handlerData"/>
 *    @load-next-page="handlerNextData"
 * />
**/

import { ErrorHandler } from '@/js/helpers/error-handler'

const PAGINATION_EVENTS = {
  firstPageLoad: 'first-page-load',
  nextPageLoad: 'next-page-load'
}

export default {
  name: 'loading-collection-button',
  props: {
    firstPageLoader: {
      type: Function,
      required: true
    }
  },
  data: _ => ({
    nextPageLoader: null
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

  .pagination__more-button {
    @include button-flat;
  }
</style>
