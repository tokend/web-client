<template>
  <div class="whitelist-invites">
    <template v-if="isLoaded">
      <template v-if="invites.length">
        <h3>{{ 'sale-whitelist.invites-title' | globalize }}</h3>

        <div class="app__table">
          <table>
            <thead>
              <th>{{ 'sale-whitelist.email-th' | globalize }}</th>
              <th>{{ 'sale-whitelist.registered-th' | globalize }}</th>
            </thead>
            <tbody>
              <tr
                v-for="invite in invites"
                :key="invite.id"
              >
                <td>
                  {{ invite.email }}
                </td>
                <td>
                  {{ invite.accounts !== undefined }}
                </td>
                <td>
                  <whitelist-invite-actions
                    :sale="sale"
                    :invite="invite"
                    @invite-removed="initFirstPageLoader"
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
      <p class="whitelist-invites-msg">
        {{ 'sale-whitelist.loading-error-msg' | globalize }}
      </p>
    </template>

    <template v-else>
      <load-spinner message-id="sale-whitelist.loading-msg" />
    </template>

    <div class="whitelist-invites__collection-loader-wrp">
      <collection-loader
        v-show="isLoaded && invites.length"
        :first-page-loader="firstPageLoader"
        @first-page-load="setInvites"
        @next-page-load="concatInvites"
      />
    </div>
  </div>
</template>

<script>
import LoadSpinner from '@/vue/common/Loader'
import NoDataMessage from '@/vue/common/NoDataMessage'
import CollectionLoader from '@/vue/common/CollectionLoader'

import WhitelistInviteActions from './WhitelistInviteActions'

import { api } from '@/api'
import { ErrorHandler } from '@/js/helpers/error-handler'

import { SaleRecord } from '@/js/records/entities/sale.record'

const EVENTS = {
  shouldUpdate: 'update:shouldUpdate',
}

export default {
  name: 'whitelist-invites',
  components: {
    LoadSpinner,
    NoDataMessage,
    CollectionLoader,
    WhitelistInviteActions,
  },

  props: {
    sale: { type: SaleRecord, required: true },
    shouldUpdate: { type: Boolean, default: false },
  },

  data: _ => ({
    isLoaded: false,
    isLoadFailed: false,
    invites: [],
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
      this.firstPageLoader = _ => this.loadInvitesWhitelist()
    },

    async loadInvitesWhitelist () {
      this.isLoaded = false
      try {
        const response = await api.getWithSignature('/invites', {
          filter: { 'sale-id': this.sale.id },
        })
        this.isLoaded = true

        return response
      } catch (e) {
        this.isLoadFailed = true
        ErrorHandler.processWithoutFeedback()
      }
    },

    setInvites (invites) {
      this.invites = invites
    },

    concatInvites (invites) {
      this.invites = this.invites.concat(invites)
    },
  },
}
</script>
