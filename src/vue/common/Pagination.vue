<template>
  <div class="pagination">
    <slot />
    <button
      class="pagination-btn"
      @click="$emit(PAGINATION_EVENTS.loadNextPage)">
      {{ 'pagination.btn-label-more' | globalize }}
    </button>
  </div>
</template>

<script>
import { ErrorHandler } from '@/js/helpers/error-handler'
const PAGINATION_EVENTS = {
  loadFirstPage: 'load-first-page',
  loadNextPage: 'load-next-page'
}

export default {
  name: '',
  components: {},
  filters: {},
  props: {
    firstPageLoader: {
      type: Function,
      require: true,
      default: () => function () {}
    }
  },
  data: _ => ({
    PAGINATION_EVENTS,
    response: {}
  }),
  computed: {},
  watch: {
    firstPageLoader () {
      this.loadFirstPage()
    }
  },
  created () {
    this.loadFirstPage()
  },
  methods: {
    async loadFirstPage () {
      try {
        const response = await this.firstPageLoader()
        this.response = response
        this.$emit(PAGINATION_EVENTS.loadFirstPage, response.data)
      } catch (e) {
        console.error(e)
        ErrorHandler.process(e)
      }
    },
    async loadNextPage () {
      try {
        const response = this.response.fetchNext()
        this.response = response
        this.$emit(PAGINATION_EVENTS.loadNextPage, response.data)
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

  .pagination-btn{
    @include button;
    transition: all 0.2s;
    &:active{
      background: lighten($col-button-flat-disabled-txt, 10%)
    }
  }
</style>
