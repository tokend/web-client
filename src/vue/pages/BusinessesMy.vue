<template>
  <div class="businesses-my">
    <template v-if="list.length">
      <div class="businesses-my__list">
        <div
          class="businesses-my__list-item-wrp"
          v-for="item in list"
          :key="item.accountId"
        >
          <button
            class="businesses-my__list-item-btn"
            @click="selectItem(item)"
          >
            <business-card :business="item" />
          </button>
        </div>
      </div>
    </template>

    <template v-else-if="!list.length && isLoading">
      <div class="businesses-my__list">
        <div
          class="businesses-my__list-item-wrp"
          v-for="item in 5"
          :key="item"
        >
          <business-card-skeleton />
        </div>
      </div>
    </template>

    <template v-else-if="!list.length && !isLoading">
      <no-data-message
        class="businesses-my__no-data-message"
        icon-name="domain"
        :title="'businesses-my.no-list-title' | globalize"
        :message="'businesses-my.no-list-msg' | globalize"
      />
    </template>

    <div class="businesses-my__requests-collection-loader">
      <collection-loader
        class="businesses-my__loader"
        :first-page-loader="getList"
        @first-page-load="setList"
        @next-page-load="concatList"
        ref="listCollectionLoader"
      />
    </div>
  </div>
</template>

<script>
import { vuexTypes } from '@/vuex'
import { mapGetters } from 'vuex'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { Bus } from '@/js/helpers/event-bus'
import { api } from '@/api'
import CollectionLoader from '@/vue/common/CollectionLoader'
import NoDataMessage from '@/vue/common/NoDataMessage'

import BusinessCard from './businesses-all/BusinessCard'
import BusinessCardSkeleton from './businesses-all/BusinessCardSkeleton'

import { BusinessRecord } from '@/js/records/entities/business.record'
import { vueRoutes } from '@/vue-router/routes'

export default {
  name: 'businesses-my',

  components: {
    CollectionLoader,
    BusinessCard,
    BusinessCardSkeleton,
    NoDataMessage,
  },

  data () {
    return {
      isLoading: false,
      list: [],
    }
  },

  computed: {
    ...mapGetters({
      accountId: vuexTypes.accountId,
    }),
  },

  methods: {
    async getList () {
      this.isLoading = true

      let result = {}
      try {
        const endpoint = `/integrations/dns/clients/${this.accountId}/businesses`
        result = await api.getWithSignature(endpoint)
      } catch (error) {
        ErrorHandler.processWithoutFeedback(error)
      }

      this.isLoading = false
      return result
    },

    setList (newList) {
      this.list = newList.map(i => new BusinessRecord(i))
    },

    concatList (newChunk) {
      this.list = this.list.concat(
        newChunk.map(i => new BusinessRecord(i))
      )
    },

    selectItem (item) {
      Bus.emit('businesses:setCurrentBusiness', {
        business: item,
        redirectTo: vueRoutes.assets,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins.scss';
@import '~@scss/variables.scss';

$list-item-margin: 2rem;
$filter-field-to-filter-field-margin: 2rem;

.businesses-my__filters {
  margin: -$filter-field-to-filter-field-margin 0 2.4rem
    (-$filter-field-to-filter-field-margin);
}

.businesses-my__filter-field {
  margin: $filter-field-to-filter-field-margin 0 0
    $filter-field-to-filter-field-margin;
}

.businesses-my__list-item-btn {
  display: block;
  width: 100%;
  max-width: 100%;
  text-align: left;
}

.businesses-my__list {
  display: flex;
  flex-wrap: wrap;
  margin: -$list-item-margin 0 0 (-$list-item-margin);
}

.businesses-my__list-item-wrp {
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

.businesses-my__loader {
  margin-top: 1rem;
}

.businesses-my__no-data-message {
  margin-top: 4.8rem;
}
</style>
