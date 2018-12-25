<template>
  <div class="pagination">
    <button
      class="pagination__more-button"
      @click="loadData(false)">
      {{ 'common.button-label-more' | globalize }}
    </button>
  </div>
</template>

<script>
/**
 * This component is responsible for downloading data in
 * which there is a pagination. Component return loaded data with action.
 *
 * @props {Function} firstPageLoader - function for downloading first page of
 * data(with filters)
 *
 * Example:
 *
 * <collection-renderer
 * :first-page-loader="function() {
 * Sdk.horizon.transaction.getAll(filters)}"
 * @load-first-page="handlerData"/>
 * @load-next-page="handlerNextData"
 * />
 *
 * You can pass a computed property that tracks filter changes and returned new
 * function.
**/

import { ErrorHandler } from '@/js/helpers/error-handler'
const PAGINATION_EVENTS = {
  loadFirstPage: 'load-first-page',
  loadNextPage: 'load-next-page'
}

export default {
  name: 'collection-renderer',
  props: {
    firstPageLoader: {
      type: Function,
      required: true
    }
  },
  data: _ => ({
    PAGINATION_EVENTS,
    nextPageCaller: null,
    response: {}
  }),
  computed: {},
  watch: {
    firstPageLoader: {
      immediate: true,
      handler () {
        this.loadData(true)
      }
    }
  },
  methods: {
    async loadData (isFirstPage) {
      try {
        let response
        if (isFirstPage) {
          response = await this.firstPageLoader()
          this.$emit(PAGINATION_EVENTS.loadNextPage, response.data)
        } else {
          response = await this.nextPageCaller()
          this.$emit(PAGINATION_EVENTS.loadNextPage, response.data)
        }
        this.nextPageCaller = response.fetchNext
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
