<template>
  <div class="sale-whitelist-registered-users">
    <template v-if="isLoaded">
      <template v-if="!registeredUsers.length">
        <h3>{{ 'sale-whitelist.registered-users-title' | globalize }}</h3>
        <div class="app__table">
          <table>
            <thead>
              <th>{{ 'sale-whitelist.user-th' | globalize }}</th>
            </thead>
            <tbody>
              <!--
                <tr
                  v-for="user in registeredUsers"
                  :key="user.id"
                >
                  <td>
                    <email-getter :account-id="user.id" />
                  </td>
                  <td>
                    <user-table-actions
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
                  <user-table-actions
                    @remove-click="removeUserFromWhitelist()"
                  />
                </td>
              </tr>

              <tr>
                <td>
                  lol@mail.com
                </td>
                <td>
                  <user-table-actions
                    @remove-click="removeUserFromWhitelist()"
                  />
                </td>
              </tr>

              <tr>
                <td>
                  alice@mail.com
                </td>
                <td>
                  <user-table-actions
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
        :title="'sale-whitelist.no-registered-users-title' | globalize"
        :message="'sale-whitelist.no-registered-users-msg' | globalize"
      />
    </template>

    <template v-else-if="isLoadFailed">
      <p class="sale-whitelist-registered-users-msg">
        {{ 'sale-whitelist.loading-error-msg' | globalize }}
      </p>
    </template>

    <template v-else>
      <load-spinner message-id="sale-whitelist.loading-msg" />
    </template>

    <div class="sale-whitelist-registered-users__collection-loader-wrp">
      <collection-loader
        v-show="isLoaded && registeredUsers.length"
        :first-page-loader="firstPageLoader"
        @first-page-load="setRegisteredUsers"
        @next-page-load="concatRegisteredUsers"
      />
    </div>
  </div>
</template>

<script>
// import EmailGetter from '@/vue/common/EmailGetter'
import LoadSpinner from '@/vue/common/Loader'
import NoDataMessage from '@/vue/common/NoDataMessage'
import CollectionLoader from '@/vue/common/CollectionLoader'

import UserTableActions from './UserTableActions'

import { Api } from '@/api'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { Bus } from '@/js/helpers/event-bus'

import { SaleRecord } from '@/js/records/entities/sale.record'

export default {
  name: 'sale-whitelist-registered-users',
  components: {
    // EmailGetter,
    LoadSpinner,
    NoDataMessage,
    CollectionLoader,
    UserTableActions,
  },

  props: {
    sale: { type: SaleRecord, required: true },
  },

  data: _ => ({
    isLoaded: false,
    isLoadFailed: false,
    registeredUsers: [],
    firstPageLoader: _ => {},
  }),

  created () {
    this.initFirstPageLoader()
  },

  methods: {
    initFirstPageLoader () {
      this.firstPageLoader = _ => this.loadRegisteredUsersWhitelist()
    },

    async loadRegisteredUsersWhitelist () {
      this.isLoaded = false
      try {
        const endpoint = `/v3/sales/${this.sale.id}/relationships/whitelist`
        const response = await Api.getWithSignature(endpoint)
        this.isLoaded = true

        return response
      } catch (e) {
        this.isLoadFailed = true
        ErrorHandler.processWithoutFeedback()
      }
    },

    setRegisteredUsers (registeredUsers) {
      this.registeredUsers = registeredUsers
    },

    concatRegisteredUsers (registeredUsers) {
      this.registeredUsers = this.registeredUsers.concat(registeredUsers)
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
