<template>
  <div class="polls-all">
    <div class="polls-all__filters">
      <template v-if="balances.length">
        <select-filter-field
          v-model="filters.assetCode"
          class="polls-all__filter-field"
          :disabled="filters.isOwnedByCurrentUser"
        >
          <option
            v-for="balance in balances"
            :key="balance.asset.code"
            :value="balance.asset.code"
          >
            {{ balance.asset.nameAndCode }}
          </option>
        </select-filter-field>
      </template>

      <select-filter-field
        v-model="filters.state"
        class="polls-all__filter-field app__select app__select--no-border"
      >
        <option :value="pollStates.open">
          {{ 'polls-all.state-open' | globalize }}
        </option>
        <option :value="pollStates.passed">
          {{ 'polls-all.state-passed' | globalize }}
        </option>
        <option :value="pollStates.failed">
          {{ 'polls-all.state-failed' | globalize }}
        </option>
        <option :value="pollStates.canceled">
          {{ 'polls-all.state-canceled' | globalize }}
        </option>
      </select-filter-field>

      <tick-filter-field
        v-if="isCorporate"
        v-model="filters.isOwnedByCurrentUser"
        :cb-value="true"
        class="polls-all__filter-field"
      >
        {{ 'polls-all.owned-by-me-filter-lbl' | globalize }}
      </tick-filter-field>
    </div>

    <template v-if="list.length">
      <div class="polls-all__list">
        <div
          class="polls-all__list-item-wrp"
          v-for="item in list"
          :key="item.id"
        >
          <button
            class="polls-all__list-item-btn"
            @click="selectItem(item)"
          >
            <poll-card :poll="item" />
          </button>
        </div>
      </div>
    </template>

    <template v-else-if="!list.length && isLoading">
      <div class="polls-all__list">
        <div
          class="polls-all__list-item-wrp"
          v-for="item in 5"
          :key="item"
        >
          <poll-card-skeleton />
        </div>
      </div>
    </template>

    <template v-else-if="!list.length && !isLoading && isInitialized">
      <no-data-message
        class="polls-all__no-data-message"
        icon-name="vote"
        :title="'polls-all.no-list-title' | globalize"
        :message="'polls-all.no-list-msg' | globalize"
      />
    </template>

    <!--
        HACK: collection loader tries to fetch the first page at any cost, but
        getList required filters.assetCode to be assigned. so the loader
        should be rendered only after filters.assetCode assigned any value
     -->
    <template v-if="filters.assetCode">
      <div class="polls-all__requests-collection-loader">
        <collection-loader
          class="polls-all__loader"
          :first-page-loader="getList"
          @first-page-load="setList"
          @next-page-load="concatList"
          ref="listCollectionLoader"
        />
      </div>
    </template>

    <drawer :is-shown.sync="isDrawerShown">
      <template slot="heading">
        {{ 'polls-all.vote-drawer-title' | globalize }}
      </template>

      <poll-viewer
        :poll-id="pollToBrowse.id"
        @close-drawer="isDrawerShown = false"
        @end-time-updated="refreshPollsList()"
        @poll-canceled="refreshPollsListWithCloseDrawer()"
        @poll-closed="refreshPollsListWithCloseDrawer()"
      />
    </drawer>
  </div>
</template>

<script>
import { vuexTypes } from '@/vuex'
import { mapGetters, mapActions } from 'vuex'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { api } from '@/api'
import CollectionLoader from '@/vue/common/CollectionLoader'
import NoDataMessage from '@/vue/common/NoDataMessage'
import Drawer from '@/vue/common/Drawer'
import PollViewer from './polls-all/PollViewer'
import PollCard from './polls-all/PollCard'
import PollCardSkeleton from './polls-all/PollCardSkeleton'

import { PollRecord } from '@/js/records/entities/poll.record'

import SelectFilterField from '@/vue/fields/SelectFilterField'
import TickFilterField from '@/vue/fields/TickFilterField'

const DELAY_REFRESH_LIST_TIME = 500

export default {
  name: 'polls-all',

  components: {
    CollectionLoader,
    Drawer,
    PollViewer,
    PollCard,
    PollCardSkeleton,
    NoDataMessage,
    SelectFilterField,
    TickFilterField,
  },

  data () {
    return {
      filters: {
        assetCode: '',
        state: PollRecord.states.open,
        isOwnedByCurrentUser: false,
      },
      isLoading: false,
      isInitialized: false,
      list: [],
      isDrawerShown: false,
      pollToBrowse: {},
      pollStates: PollRecord.states,
    }
  },

  computed: {
    ...mapGetters({
      balances: vuexTypes.accountBalances,
      accountId: vuexTypes.accountId,
      isCorporate: vuexTypes.isAccountCorporate,
    }),
  },

  watch: {
    'filters.assetCode' () {
      this.reloadListIfInitialized()
    },

    'filters.state' () {
      this.reloadListIfInitialized()
    },

    'filters.isOwnedByCurrentUser' () {
      this.reloadListIfInitialized()
    },
  },

  async created () {
    try {
      await this.initAssetCodeFilter()
    } catch (error) {
      ErrorHandler.processWithoutFeedback(error)
    }
    this.isInitialized = true
  },

  methods: {
    ...mapActions({
      loadBalances: vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS,
    }),

    async initAssetCodeFilter () {
      if (!this.balances.length) {
        await this.loadBalances()
      }

      this.preSetAssetCodeFilter()
    },

    preSetAssetCodeFilter () {
      if (!this.balances.length || this.filters.assetCode) {
        return
      }

      const isQueryAssetCodePresentInBalances = Boolean(
        this.$route.query.asset &&
        this.balances.find(i => i.asset.code === this.$route.query.asset)
      )

      this.filters.assetCode = isQueryAssetCodePresentInBalances
        ? this.$route.query.asset
        : this.balances[0].asset.code
    },

    async getList () {
      this.isLoading = true

      let result
      try {
        result = await api.getWithSignature('/v3/polls', {
          filter: {
            owner: this.filters.isOwnedByCurrentUser
              ? this.accountId
              : this.balances
                .find(i => i.asset.code === this.filters.assetCode)
                .asset.owner,

            state: this.filters.state,
          },
        })
      } catch (error) {
        ErrorHandler.processWithoutFeedback(error)
      }

      this.isLoading = false
      return result
    },

    setList (newList) {
      this.list = newList.map(i => new PollRecord(i))
    },

    concatList (newChunk) {
      this.list = this.list.concat(
        newChunk.map(i => new PollRecord(i))
      )
    },

    reloadList () {
      return this.$refs.listCollectionLoader.loadFirstPage()
    },

    reloadListIfInitialized () {
      if (!this.isInitialized) {
        return
      }
      this.reloadList()
    },

    selectItem (item) {
      this.pollToBrowse = item
      this.isDrawerShown = true
    },

    refreshPollsList () {
      setTimeout(() => {
        this.reloadList()
      }, DELAY_REFRESH_LIST_TIME)
    },

    refreshPollsListWithCloseDrawer () {
      this.isDrawerShown = false
      this.refreshPollsList()
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins.scss';
@import '~@scss/variables.scss';

$list-item-margin: 2rem;
$filter-field-to-filter-field-margin: 2rem;

.polls-all__filters {
  margin: -$filter-field-to-filter-field-margin 0 2.4rem
    (-$filter-field-to-filter-field-margin);
}

.polls-all__filter-field {
  margin: $filter-field-to-filter-field-margin 0 0
    $filter-field-to-filter-field-margin;
}

.polls-all__list-item-btn {
  display: block;
  width: 100%;
  max-width: 100%;
  text-align: left;
}

.polls-all__list {
  display: flex;
  flex-wrap: wrap;
  margin: -$list-item-margin 0 0 (-$list-item-margin);
}

.polls-all__list-item-wrp {
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

.polls-all__loader {
  margin-top: 1rem;
}

.polls-all__no-data-message {
  margin-top: 4.8rem;
}
</style>
