<template>
  <div class="collection">
    <button
      v-if="!isNoMoreEntries"
      class="collection__more-button app__button-flat"
      @click="loadPage(nextPageLoader)"
    >
      {{ 'common.more-btn' | globalize }}
    </button>
  </div>
</template>

<script>
const EVENTS = {
  input: 'input',
}

const DEFAULT_PAGE_LIMIT = 10

export default {
  name: 'collection',
  props: {
    loader: {
      type: Function,
      required: true,
    },
    value: {
      type: Array,
      required: true,
    },
    pageLimit: {
      type: Number,
      default: DEFAULT_PAGE_LIMIT,
    },
  },
  data: _ => ({
    nextPageLoader: Function,
    isLoading: false,
    isEmpty: true,
    isFailed: false,
    isNoMoreEntries: false,
    isFetchedFirst: true,
  }),
  mounted () {
    this.loadPage(this.loader)
  },
  methods: {
    async loadPage (loaderFn) {
      try {
        const response = await loaderFn()
        this.nextPageLoader = response.fetchNext
        const extendedValue = this.value.concat(response.data)
        this.$emit(EVENTS.input, extendedValue)
        this.isNoMoreEntries = response.data.length < this.pageLimit
      } catch (e) {
        this.$emit(EVENTS.error, e)
        // ErrorHandler.processWithoutFeedback(e)
      }
    },
    setLoader () {
    },
    reload (loaderFn) {
      this.$emit(EVENTS.input, [])
      this.loadPage(loaderFn)
    },

  },
}
</script>

<style lang="scss" scoped>
  @import '~@scss/variables';
  @import '~@scss/mixins';

  .collection {
    display: flex;
    justify-content: center;
  }
</style>
