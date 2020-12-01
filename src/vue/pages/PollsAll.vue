<template>
  <div class="polls-all">
    <div class="polls-all__filters">
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

      <!-- TODO: temp. hidden -->
      <!-- <tick-filter-field
        v-if="isCorporate"
        v-model="filters.isOwnedByCurrentUser"
        :cb-value="true"
        class="polls-all__filter-field"
      >
        {{ 'polls-all.owned-by-me-filter-lbl' | globalize }}
      </tick-filter-field> -->
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

    <template v-else-if="!list.length && !isLoading">
      <no-data-message
        class="polls-all__no-data-message"
        icon-name="vote"
        :title="'polls-all.no-list-title' | globalize"
        :message="'polls-all.no-list-msg' | globalize"
      />
    </template>

    <div class="polls-all__requests-collection-loader">
      <collection-loader
        class="polls-all__loader"
        :first-page-loader="getList"
        @first-page-load="setList"
        @next-page-load="concatList"
        ref="listCollectionLoader"
      />
    </div>

    <drawer :is-shown.sync="isDrawerShown">
      <template slot="heading">
        {{ 'polls-all.vote-drawer-title' | globalize }}
      </template>

      <poll-viewer
        :current-poll="pollToBrowse"
        @close-drawer="isDrawerShown = false"
        @end-time-updated="emitUpdateList('polls:updateList')"
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
import UpdateList from '@/vue/mixins/update-list.mixin'

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
  },

  mixins: [UpdateList],

  data () {
    return {
      filters: {
        state: PollRecord.states.open,
        isOwnedByCurrentUser: false,
      },
      isLoading: false,
      list: [],
      isDrawerShown: false,
      pollToBrowse: {},
      pollStates: PollRecord.states,
    }
  },

  computed: {
    ...mapGetters({
      accountId: vuexTypes.accountId,
      isCorporate: vuexTypes.isAccountCorporate,
    }),
  },

  watch: {
    'filters.state' () {
      this.reloadList()
    },

    'filters.isOwnedByCurrentUser' () {
      this.reloadList()
    },
  },

  created () {
    this.listenUpdateList('polls:updateList', this.reloadList)
  },

  methods: {
    ...mapActions({
      loadBalances: vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS,
    }),

    async getList () {
      this.isLoading = true

      let result
      try {
        result = await api.getWithSignature('/v3/polls', {
          filter: {
            ...(
              this.filters.isOwnedByCurrentUser
                ? { owner: this.accountId }
                : {}
            ),
            ...(
              this.$route.query.owner
                ? { owner: this.$route.query.owner }
                : {}
            ),
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

    selectItem (item) {
      this.pollToBrowse = item
      this.isDrawerShown = true
    },

    refreshPollsListWithCloseDrawer () {
      this.isDrawerShown = false
      this.updateList('polls:updateList')
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
