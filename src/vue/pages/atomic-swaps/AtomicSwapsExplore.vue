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
            <atomic-swap-card :atomic-swap-ask="item" />
          </button>
        </div>
      </div>
    </template>

    <template v-else-if="!list.length && !isLoading">
      <no-data-message
        class="atomic-swaps-explore__no-data-message"
        icon-name="swap-horizontal"
        :title="'atomic-swaps-explore.no-list-title' | globalize"
        :message="'atomic-swaps-explore.no-list-msg' | globalize"
      />
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
    <template v-if="isLoggedIn">
      <drawer :is-shown.sync="isDrawerShown">
        <template
          v-if="atomicSwapToBrowse.ownerId === accountId"
          slot="heading"
        >
          {{ 'atomic-swaps-explore.atomic-swap-drawer-title' | globalize }}
        </template>
        <template v-else slot="heading">
          {{ 'atomic-swaps-explore.buying' |
            globalize({asset: atomicSwapToBrowse.baseAssetName}) }}
        </template>

        <atomic-swap-viewer
          v-if="atomicSwapToBrowse.ownerId === accountId"
          :current-atomic-swap-ask="atomicSwapToBrowse"
          @close-drawer-and-update-list="closeDrawerAndUpdateList()"
        />
        <atomic-swap-form
          v-else
          @update-list="updateList()"
          :atomic-swap-ask="atomicSwapToBrowse"
        />
      </drawer>
    </template>
  </div>
</template>

<script>
import CollectionLoader from '@/vue/common/CollectionLoader'
import Drawer from '@/vue/common/Drawer'
import AtomicSwapCard from './AtomicSwapCard'
import AtomicSwapViewer from './AtomicSwapViewer'
import NoDataMessage from '@/vue/common/NoDataMessage'
import UpdateList from '@/vue/mixins/update-list.mixin'
import AtomicSwapForm from '@modules/atomic-swap-form'
import { AtomicSwapAskRecord } from '@/js/records/entities/atomic-swap-ask.record'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { vueRoutes } from '@/vue-router/routes'
import { api } from '@/api'
import { vuexTypes } from '@/vuex'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'atomic-swaps-explore',

  components: {
    CollectionLoader,
    Drawer,
    AtomicSwapCard,
    AtomicSwapViewer,
    NoDataMessage,
    AtomicSwapForm,
  },

  mixins: [UpdateList],
  props: {
    businessId: {
      type: String,
      default: '',
    },
    selectedAssetCode: {
      type: String,
      default: '',
    },
  },
  data () {
    return {
      isLoading: false,
      list: [],
      isDrawerShown: false,
      atomicSwapToBrowse: {},
      filters: {
        isOwnedByCurrentUser: false,
      },
    }
  },

  computed: {
    ...mapGetters({
      accountId: vuexTypes.accountId,
      isCorporate: vuexTypes.isAccountCorporate,
      businessToBrowse: vuexTypes.businessToBrowse,
      isLoggedIn: vuexTypes.isLoggedIn,
    }),
  },

  watch: {
    'filters.isOwnedByCurrentUser' () {
      this.reloadList()
    },
  },

  async created () {
    await this.loadAssets()
    this.listenUpdateList('atomicSwaps:updateList', this.reloadList)
  },

  methods: {
    ...mapActions({
      loadAssets: vuexTypes.LOAD_ASSETS,
    }),

    async getList () {
      this.isLoading = true

      let result
      let filter = {
        ...(
          this.businessToBrowse.accountId
            ? { owner: this.businessToBrowse.accountId }
            : { owner: this.accountId }
        ),
      }
      if (this.businessId) {
        filter.owner = this.businessId
      }

      try {
        result = await api.get('/integrations/marketplace/offers', {
          filter: filter,
        })
      } catch (error) {
        ErrorHandler.processWithoutFeedback(error)
      }

      this.isLoading = false
      return result
    },

    setList (newList) {
      this.list = newList.map(i => new AtomicSwapAskRecord(i))
    },

    concatList (newChunk) {
      this.list = this.list.concat(
        newChunk.map(i => new AtomicSwapAskRecord(i))
      )
    },

    reloadList () {
      return this.$refs.listCollectionLoader.loadFirstPage()
    },

    async selectItem (item) {
      if (this.$route.name === vueRoutes.business.name) {
        await this.$router.push({
          ...vueRoutes.pay,
          query: {
            id: item.id,
          },
        })
      } else {
        this.atomicSwapToBrowse = item
        this.isDrawerShown = true
      }
    },

    closeDrawerAndUpdateList () {
      this.isDrawerShown = false
      this.emitUpdateList('atomicSwaps:updateList')
    },
    updateList () {
      this.emitUpdateList('atomicSwaps:updateList')
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins.scss';
@import '~@scss/variables.scss';

$list-item-margin: 2rem;
$new-list-item-margin: 2rem;
$filter-field-to-filter-field-margin: 2rem;

.atomic-swaps-explore__filters {
  margin: -$filter-field-to-filter-field-margin 0 2.4rem
    (-$filter-field-to-filter-field-margin);
}

.atomic-swaps-explore__filter-field {
  margin: $filter-field-to-filter-field-margin 0 0
    $filter-field-to-filter-field-margin;
}

.atomic-swaps-explore__list-item-btn {
  display: block;
  width: 100%;
  max-width: 100%;
  text-align: left;
  height: 100%;
}

.atomic-swaps-explore__list {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}

.atomic-swaps-explore__list-item-wrp {
  margin: $list-item-margin $list-item-margin 0 0;
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
    @include list-item-width(50%);
  }
  @include respond-to(small) {
    @include list-item-width(100%);
  }
  @include respond-to(xsmall) {
    @include list-item-width(100%);
  }
}

.atomic-swaps-explore__loader {
  margin-top: 1rem;
}
</style>
