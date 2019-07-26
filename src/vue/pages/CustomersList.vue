<template>
  <div class="customers-list">
    <div class="customers-list__table-wrp">
      <customers-table
        :customers-list="list"
        :is-loaded="isLoaded"
        :is-load-failed="isLoadFailed"
        @details-button-clicked="
          (customerToBrowse = $event) && (isDrawerShown = true)
        "
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
    </drawer>
  </div>
</template>

<script>
import { ErrorHandler } from '@/js/helpers/error-handler'

import { api } from '@/api'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

import CollectionLoader from '@/vue/common/CollectionLoader'
import Drawer from '@/vue/common/Drawer'

import { CustomerRecord } from './customers-list/customer.record'
import CustomerAttributes from './customers-list/CustomerAttributes'
import CustomersTable from './customers-list/CustomersTable'
import { Bus } from '@/js/helpers/event-bus'
import { errors } from '@tokend/js-sdk'

export default {
  name: 'customers-list',

  components: {
    CollectionLoader,
    Drawer,
    CustomerAttributes,
    CustomersTable,
  },

  data () {
    return {
      list: [],
      isLoaded: false,
      isLoadFailed: false,
      isDrawerShown: false,
      customerToBrowse: {},
    }
  },

  computed: {
    ...mapGetters([vuexTypes.accountId]),
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
  },
}
</script>

<style lang="scss">
.customers-list__loader {
  margin-top: 1rem;
}
</style>
