<template>
  <div class="collection">
    <button
      v-if="!isNoMoreEntries"
      class="collection-loader__more-button app__button-flat"
      @click="extendList"
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
  watch: {
    loader: {
      immediate: true,
      handler: async function (loaderFunction) {
        let response = await loaderFunction()
        this.nextPageLoader = response.fetchNext
        this.$emit(EVENTS.input, response.data)
        console.log(response)
      },
    },
  },
  mounted () {
    // let some = await this.loader()
    // console.log(some)
  },
  methods: {
    async extendList () {
      try {
        let response = await this.nextPageLoader()
        this.nextPageLoader = response.fetchNext
        let extendedValue = this.value.concat(response.data)
        this.$emit(EVENTS.input, extendedValue)
        this.isNoMoreEntries = response.data.length < this.pageLimit
        console.log(response)
      } catch (e) {
        console.log(e)
      }
    },
    setLoader () {
    },
    reload () {
    },
  },
}
</script>

<style lang="scss" scoped>
  @import '~@scss/variables';
  @import '~@scss/mixins';

  .collection-loader {
    display: flex;
    justify-content: center;
  }
</style>
