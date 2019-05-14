<template>
  <div class="sale-whitelist-unregistered-users">
    <template v-if="isLoaded">
      <template v-if="unregisteredUsers.length">
        <h3>{{ 'sale-whitelist.unregistered-users-title' | globalize }}</h3>
        <div class="app__table">
          <table>
            <thead>
              <th>{{ 'sale-whitelist.email-th' | globalize }}</th>
            </thead>
            <tbody>
              <!--
                <tr
                  v-for="user in unregisteredUsers"
                  :key="user.id"
                >
                  <td>
                    {{ user.email }}
                  </td>
                  <td>
                    <whitelist-table-actions
                      @remove-click="removeUserFromWhitelist(user)"
                    />
                  </td>
                </tr>
              -->
              <tr>
                <td>
                  mail@mail.com
                </td>
                <td>
                  <whitelist-table-actions
                    @remove-click="removeUserFromWhitelist()"
                  />
                </td>
              </tr>

              <tr>
                <td>
                  lol@mail.com
                </td>
                <td>
                  <whitelist-table-actions
                    @remove-click="removeUserFromWhitelist()"
                  />
                </td>
              </tr>

              <tr>
                <td>
                  alice@mail.com
                </td>
                <td>
                  <whitelist-table-actions
                    @remove-click="removeUserFromWhitelist()"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>

      <no-data-message
        v-else
        icon-name="trending-up"
        :title="'sale-whitelist.no-unregistered-users-title' | globalize"
        :message="'sale-whitelist.no-unregistered-users-msg' | globalize"
      />
    </template>

    <template v-else-if="isLoadFailed">
      <p class="sale-whitelist-unregistered-users-msg">
        {{ 'sale-whitelist.loading-error-msg' | globalize }}
      </p>
    </template>

    <template v-else>
      <load-spinner message-id="sale-whitelist.loading-msg" />
    </template>

    <div class="sale-whitelist-unregistered-users__collection-loader-wrp">
      <collection-loader
        v-show="isLoaded && unregisteredUsers.length"
        :first-page-loader="firstPageLoader"
        @first-page-load="setUnregisteredUsers"
        @next-page-load="concatUnregisteredUsers"
      />
    </div>
  </div>
</template>

<script>
import LoadSpinner from '@/vue/common/Loader'
import NoDataMessage from '@/vue/common/NoDataMessage'
import CollectionLoader from '@/vue/common/CollectionLoader'

import WhitelistTableActions from './WhitelistTableActions'

import { Api } from '@/api'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { Bus } from '@/js/helpers/event-bus'

import { SaleRecord } from '@/js/records/entities/sale.record'

const EVENTS = {
  shouldUpdate: 'update:shouldUpdate',
}

export default {
  name: 'sale-whitelist-unregistered-users',
  components: {
    LoadSpinner,
    NoDataMessage,
    CollectionLoader,
    WhitelistTableActions,
  },

  props: {
    sale: { type: SaleRecord, required: true },
    shouldUpdate: { type: Boolean, default: false },
  },

  data: _ => ({
    isLoaded: false,
    isLoadFailed: false,
    unregisteredUsers: [],
    firstPageLoader: _ => {},
  }),

  watch: {
    shouldUpdate: function (value) {
      if (value) {
        this.initFirstPageLoader()
        this.$emit(EVENTS.shouldUpdate, false)
      }
    },
  },

  created () {
    this.initFirstPageLoader()
  },

  methods: {
    initFirstPageLoader () {
      this.firstPageLoader = _ => this.loadUnregisteredUsersWhitelist()
    },

    async loadUnregisteredUsersWhitelist () {
      this.isLoaded = false
      try {
        // TODO: endpoint to be provided
        const endpoint = `/v3/sales/${this.sale.id}/relationships/whitelist`
        const response = await Api.getWithSignature(endpoint)
        this.isLoaded = true

        return response
      } catch (e) {
        this.isLoadFailed = true
        ErrorHandler.processWithoutFeedback()
      }
    },

    setUnregisteredUsers (users) {
      this.unregisteredUsers = users
    },

    concatUnregisteredUsers (users) {
      this.unregisteredUsers = this.unregisteredUsers.concat(users)
    },

    async removeUserFromWhitelist (user) {
      try {
        alert('Removing to be provided')
        // TODO: remove user from white list
        Bus.success('sale-whitelist.user-removed-msg')
        this.initFirstPageLoader()
      } catch (e) {
        ErrorHandler.process(e)
      }
    },
  },
}
</script>
