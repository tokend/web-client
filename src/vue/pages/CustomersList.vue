<template>
  <div class="customers-list">
    <div class="customers-list__table-wrp">
      <customers-table
        :customers-list="list"
        :is-loaded="isLoaded"
        :is-load-failed="isLoadFailed"
        @details-button-clicked="setCustomerToBrowse($event)"
      />
    </div>

    <collection-loader
      class="customers-list__loader"
      :first-page-loader="getList"
      @first-page-load="setList"
      @next-page-load="concatList"
      ref="listCollectionLoader"
    />

    <drawer :is-shown.sync="isDrawerShown">
      <template slot="heading">
        {{ 'customers-list.customer-drawer-title' | globalize }}
      </template>

      <customer-attributes
        :customer="customerToBrowse"
        @close-drawer="isDrawerShown = false"
      />

      <template v-if="assetsCodes.length">
        <div class="customers-list__user-movements-history-select">
          <select-field
            :value="assetCode"
            @input="setAssetCode"
            class="app__select"
          >
            <option
              v-for="asset in assetsCodes"
              :key="asset"
              :value="asset"
            >
              {{ assetByCode(asset).name }}
            </option>
          </select-field>
        </div>
      </template>

      <movements-history
        :customer="customerToBrowse"
        :asset-code="assetCode"
        class="customers-list__user-movements-history"
      />
    </drawer>
  </div>
</template>

<script>
import CollectionLoader from '@/vue/common/CollectionLoader'
import Drawer from '@/vue/common/Drawer'
import SelectField from '@/vue/fields/SelectField'
import _isEmpty from 'lodash/isEmpty'
import MovementsHistory from '@/vue/modules/movements-history'

import CustomerAttributes from './customers-list/CustomerAttributes'
import CustomersTable from './customers-list/CustomersTable'
import { Bus } from '@/js/helpers/event-bus'
import { errors } from '@tokend/js-sdk'
import { CustomerRecord } from '@/js/records/entities/customer.record'
import { ErrorHandler } from '@/js/helpers/error-handler'

import { api } from '@/api'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

export default {
  name: 'customers-list',

  components: {
    CollectionLoader,
    Drawer,
    CustomerAttributes,
    CustomersTable,
    SelectField,
    MovementsHistory,
  },

  data () {
    return {
      list: [],
      assetCode: '',
      isLoaded: false,
      isLoadFailed: false,
      isDrawerShown: false,
      customerToBrowse: {},
    }
  },

  computed: {
    ...mapGetters([
      vuexTypes.accountId,
      vuexTypes.assetByCode,
    ]),

    assetsCodes () {
      if (!_isEmpty(this.customerToBrowse)) {
        return this.customerToBrowse.balances.map(item => item.assetCode)
      } else {
        return []
      }
    },
  },

  created () {
    this.listen()
  },

  methods: {
    listen () {
      Bus.on('customers:updateList', () => {
        this.reloadList()
      })
    },

    async getList () {
      let result

      try {
        result = await api.getWithSignature(
          `/integrations/dns/businesses/${this.accountId}/clients`,
          { include: ['balances'] },
        )
        this.isLoaded = true
      } catch (error) {
        // TODO: remove whe back-end returns empty data instead of 404
        if (error instanceof errors.NotFoundError) {
          this.isLoaded = true
          result = {
            data: [],
            links: {},
          }
        } else {
          this.isLoaded = false
          this.isLoadFailed = true
          ErrorHandler.processWithoutFeedback(error)
        }
      }

      return result
    },

    setList (newList) {
      this.list = newList.map(i => new CustomerRecord(i))
    },

    concatList (newChunk) {
      this.list = this.list.concat(
        newChunk.map(i => new CustomerRecord(i))
      )
    },

    reloadList () {
      return this.$refs.listCollectionLoader.loadFirstPage()
    },

    setAssetCode (assetCode) {
      this.assetCode = assetCode
    },

    setCustomerToBrowse ($event) {
      this.customerToBrowse = $event
      this.assetCode = this.assetsCodes[0]
      this.isDrawerShown = true
    },
  },
}
</script>

<style lang="scss">
.customers-list__loader {
  margin-top: 1rem;
}

.customers-list__user-movements-history-select {
  margin-top: 2rem;
  margin-bottom: 1.5rem;
  padding: 0 1.6rem;
}
</style>
