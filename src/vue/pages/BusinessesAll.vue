<template>
  <div class="businesses-all">
    <template v-if="list.length">
      <div class="businesses-all__list">
        <div
          class="businesses-all__list-item-wrp"
          v-for="item in list"
          :key="item.accountId"
        >
          <button
            class="businesses-all__list-item-btn"
            @click="selectItem(item)"
          >
            <business-card :business="item" />
          </button>
        </div>
      </div>
    </template>

    <template v-else-if="!list.length && isLoading">
      <div class="businesses-all__list">
        <div
          class="businesses-all__list-item-wrp"
          v-for="item in 5"
          :key="item"
        >
          <business-card-skeleton />
        </div>
      </div>
    </template>

    <template v-else-if="!list.length && !isLoading">
      <no-data-message
        class="businesses-all__no-data-message"
        icon-name="domain"
        :title="'businesses-all.no-list-title' | globalize"
        :message="'businesses-all.no-list-msg' | globalize"
      />
    </template>

    <drawer :is-shown.sync="isDrawerShown">
      <template slot="heading">
        {{ 'businesses-all.business-details-title' | globalize }}
      </template>

      <template v-if="isCustomerUiShown || isAccountGeneral">
        <business-viewer
          :business="currentBusiness"
          @business-added="closeDrawerAndUpdateList"
        />
      </template>
      <template v-else>
        <business-attributes
          :business="currentBusiness"
        />
        <template v-if="!isBusinessOwner">
          <h3 class="businesses-all__bussiness-assets-title">
            {{ 'businesses-all.business-assets-title' | globalize }}
          </h3>
          <business-assets-viewer
            :business="currentBusiness"
          />
        </template>
      </template>
    </drawer>

    <div class="businesses-all__requests-collection-loader">
      <collection-loader
        class="businesses-all__loader"
        :first-page-loader="getList"
        @first-page-load="setList"
        @next-page-load="concatList"
        ref="listCollectionLoader"
      />
    </div>
  </div>
</template>

<script>
import CollectionLoader from '@/vue/common/CollectionLoader'
import NoDataMessage from '@/vue/common/NoDataMessage'
import BusinessCard from './businesses-all/BusinessCard'
import BusinessCardSkeleton from './businesses-all/BusinessCardSkeleton'
import Drawer from '@/vue/common/Drawer'
import BusinessViewer from './businesses-all/BusinessViewer'
import BusinessAttributes from './businesses-all/BusinessAttributes'
import BusinessAssetsViewer from './businesses-all/BusinessAssetsViewer'

import { vuexTypes } from '@/vuex'
import { mapGetters } from 'vuex'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { Bus } from '@/js/helpers/event-bus'
import { api } from '@/api'

import { BusinessRecord } from '@/js/records/entities/business.record'
import { vueRoutes } from '@/vue-router/routes'

export default {
  name: 'businesses-all',

  components: {
    CollectionLoader,
    BusinessCard,
    BusinessCardSkeleton,
    NoDataMessage,
    Drawer,
    BusinessViewer,
    BusinessAttributes,
    BusinessAssetsViewer,
  },

  data () {
    return {
      isLoading: false,
      list: [],
      myBusiness: [],
      isDrawerShown: false,
      currentBusiness: {},
      isMyBusiness: false,
    }
  },

  computed: {
    ...mapGetters({
      accountId: vuexTypes.accountId,
      isCustomerUiShown: vuexTypes.isCustomerUiShown,
      isAccountGeneral: vuexTypes.isAccountGeneral,
    }),

    isBusinessOwner () {
      return Boolean(this.currentBusiness.accountId === this.accountId)
    },
  },

  async created () {
    await this.getMyBusiness()
  },

  methods: {
    async getList () {
      this.isLoading = true

      let result
      try {
        const endpoint = `/integrations/dns/businesses`
        result = await api.getWithSignature(endpoint)
      } catch (error) {
        ErrorHandler.processWithoutFeedback(error)
      }

      this.isLoading = false
      return result
    },

    async getMyBusiness () {
      try {
        const endpoint = `/integrations/dns/clients/${this.accountId}/businesses`
        const { data } = await api.getWithSignature(endpoint)
        this.myBusiness = data.map(i => new BusinessRecord(i))
      } catch (error) {
        ErrorHandler.processWithoutFeedback(error)
      }
    },

    checkIsMyBusiness (currentBusiness) {
      return Boolean(this.myBusiness.find(business => {
        return business.id === currentBusiness.id
      })
      )
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
      this.isMyBusiness = this.checkIsMyBusiness(item)
      // eslint-disable-next-line max-len
      if (this.isMyBusiness && (this.isCustomerUiShown || this.isAccountGeneral)) {
        Bus.emit('businesses:setCurrentBusiness', {
          business: item,
          redirectTo: vueRoutes.assets,
        })
      } else {
        this.currentBusiness = item
        this.isDrawerShown = true
      }
    },

    reloadList () {
      return this.$refs.listCollectionLoader.loadFirstPage()
    },

    async closeDrawerAndUpdateList () {
      this.isDrawerShown = false
      this.reloadList()
      await this.getMyBusiness()
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins.scss';
@import '~@scss/variables.scss';

$list-item-margin: 2rem;
$filter-field-to-filter-field-margin: 2rem;

.businesses-all__filters {
  margin: -$filter-field-to-filter-field-margin 0 2.4rem
    (-$filter-field-to-filter-field-margin);
}

.businesses-all__filter-field {
  margin: $filter-field-to-filter-field-margin 0 0
    $filter-field-to-filter-field-margin;
}

.businesses-all__list-item-btn {
  display: block;
  width: 100%;
  max-width: 100%;
  text-align: left;
}

.businesses-all__list {
  display: flex;
  flex-wrap: wrap;
  margin: -$list-item-margin 0 0 (-$list-item-margin);
}

.businesses-all__list-item-wrp {
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

.businesses-all__loader {
  margin-top: 1rem;
}

.businesses-all__no-data-message {
  margin-top: 4.8rem;
}

.businesses-all__bussiness-assets-title {
  margin: 2rem 0;
}
</style>
