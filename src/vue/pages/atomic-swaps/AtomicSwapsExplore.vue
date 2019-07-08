<template>
  <div class="atomic-swaps-explore">
    <template v-if="list.length">
      <div class="atomic-swaps-explore__list">
        <div
          class="atomic-swaps-explore__list-item-wrp"
          v-for="item in list"
          :key="item.id"
        >
          <button
            class="atomic-swaps-explore__list-item-btn"
            @click="selectItem(item)"
          >
            <atomic-swap-card :atomic-swap="item" />
          </button>
        </div>
      </div>
    </template>

    <div class="atomic-swaps-explore__requests-collection-loader">
      <collection-loader
        class="atomic-swaps-explore__loader"
        :first-page-loader="getList"
        @first-page-load="setList"
        @next-page-load="concatList"
        ref="listCollectionLoader"
      />
    </div>

    <drawer :is-shown.sync="isDrawerShown">
      <template slot="heading">
        {{ 'atomic-swaps-explore.atomic-swap-drawer-title' | globalize }}
      </template>

      <atomic-swap-viewer
        :current-atomic-swap="atomicSwapToBrowse"
        @close-drawer="isDrawerShown = false"
      />
    </drawer>
  </div>
</template>

<script>
import { ErrorHandler } from '@/js/helpers/error-handler'
import { api } from '@/api'
import CollectionLoader from '@/vue/common/CollectionLoader'
import Drawer from '@/vue/common/Drawer'
import { AtomicSwapRecord } from '@/js/records/entities/atomic-swap.record'
import AtomicSwapCard from './AtomicSwapCard'
import AtomicSwapViewer from './AtomicSwapViewer'

export default {
  name: 'atomic-swaps-explore',

  components: {
    CollectionLoader,
    Drawer,
    AtomicSwapCard,
    AtomicSwapViewer,
  },

  data () {
    return {
      isLoading: false,
      list: [],
      isDrawerShown: false,
      atomicSwapToBrowse: {},
    }
  },

  methods: {
    async getList () {
      this.isLoading = true

      let result
      try {
        result = await api.getWithSignature('/v3/atomic_swap_asks', {
          include: ['owner', 'base_asset', 'quote_assets'],
        })
      } catch (error) {
        ErrorHandler.processWithoutFeedback(error)
      }

      this.isLoading = false
      return result
    },

    setList (newList) {
      this.list = newList.map(i => new AtomicSwapRecord(i))
    },

    concatList (newChunk) {
      this.list = this.list.concat(
        newChunk.map(i => new AtomicSwapRecord(i))
      )
    },

    reloadList () {
      return this.$refs.listCollectionLoader.loadFirstPage()
    },

    selectItem (item) {
      this.atomicSwapToBrowse = item
      this.isDrawerShown = true
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins.scss';
@import '~@scss/variables.scss';

$list-item-margin: 2rem;

.atomic-swaps-explore__list-item-btn {
  display: block;
  width: 100%;
  max-width: 100%;
  text-align: left;
}

.atomic-swaps-explore__list {
  display: flex;
  flex-wrap: wrap;
  margin: -$list-item-margin 0 0 (-$list-item-margin);
}

.atomic-swaps-explore__list-item-wrp {
  margin: $list-item-margin 0 0 $list-item-margin;
  width: calc(100% + #{$list-item-margin});

  $media-desktop: 1130px;
  $media-small-desktop: 960px;

  @mixin list-item-width($width) {
    flex: 0 1 calc(#{$width} - (#{$list-item-margin}));
    max-width: calc(#{$width} - (#{$list-item-margin}));
  }

  @include list-item-width(25%);
  @include respond-to-custom($media-desktop) {
    @include list-item-width(33%);
  }
  @include respond-to-custom($media-small-desktop) {
    @include list-item-width(50%);
  }
  @include respond-to-custom($sidebar-hide-bp) {
    @include list-item-width(33%);
  }
  @include respond-to(small) {
    @include list-item-width(50%);
  }
  @include respond-to(xsmall) {
    @include list-item-width(100%);
  }
}
</style>
