<template>
  <div class="whitelist-invitations-list">
    <template v-if="isLoaded">
      <template v-if="invitations.length">
        <div class="whitelist-invitations-list__actions-wrp">
          <template v-if="isRemovalMode">
            <button
              class="app__button-raised
                     app__button-raised--danger
                     whitelist-invitations-list__action"
              @click="removeInvitations"
              :disabled="!invitationsToRemove.length || isInvitationsRemoving"
            >
              <template v-if="isInvitationsRemoving">
                {{ 'sale-whitelist.processing-btn' | globalize }}
              </template>

              <template v-else>
                {{ 'sale-whitelist.confirm-removal-btn' | globalize }}
              </template>
            </button>

            <button
              class="app__button-raised whitelist-invitations-list__action"
              @click="cancelRemovalMode"
              :disabled="isInvitationsRemoving"
            >
              {{ 'sale-whitelist.cancel-removal-btn' | globalize }}
            </button>
          </template>

          <template v-else>
            <button
              class="app__button-raised whitelist-invitations-list__action"
              @click="isRemovalMode = true"
            >
              {{ 'sale-whitelist.edit-invitations-btn' | globalize }}
            </button>
          </template>
        </div>

        <div class="app__table whitelist-invitations-list__table">
          <table>
            <thead>
              <th v-if="isRemovalMode" />
              <th>{{ 'sale-whitelist.email-th' | globalize }}</th>
              <th>{{ 'sale-whitelist.registered-th' | globalize }}</th>
            </thead>
            <tbody>
              <tr
                v-for="invitation in invitations"
                :key="invitation.id"
              >
                <td v-if="isRemovalMode">
                  <tick-field v-model="invitation.shouldBeRemoved">
                    &nbsp;
                  </tick-field>
                </td>

                <td>
                  {{ invitation.email }}
                </td>

                <td>
                  <template v-if="invitation.accounts">
                    {{ 'sale-whitelist.yes-msg' | globalize }}
                  </template>

                  <template v-else>
                    {{ 'sale-whitelist.no-msg' | globalize }}
                  </template>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>

      <no-data-message
        v-else
        icon-name="trending-up"
        :title="'sale-whitelist.no-invitations-title' | globalize"
        :message="'sale-whitelist.no-invitations-msg' | globalize"
      />
    </template>

    <template v-else-if="isLoadFailed">
      <p class="whitelist-invitations-list-msg">
        {{ 'sale-whitelist.loading-error-msg' | globalize }}
      </p>
    </template>

    <template v-else>
      <load-spinner message-id="sale-whitelist.loading-msg" />
    </template>

    <div class="whitelist-invitations-list__collection-loader-wrp">
      <collection-loader
        v-show="isLoaded && invitations.length"
        :first-page-loader="firstPageLoader"
        @first-page-load="setInvitations"
        @next-page-load="concatInvitations"
      />
    </div>
  </div>
</template>

<script>
import LoadSpinner from '@/vue/common/Loader'
import NoDataMessage from '@/vue/common/NoDataMessage'
import CollectionLoader from '@/vue/common/CollectionLoader'
import TickField from '@/vue/fields/TickField'

import { api } from '@/api'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { Bus } from '@/js/helpers/event-bus'

import { SaleRecord } from '@/js/records/entities/sale.record'

export default {
  name: 'whitelist-invitations-list',
  components: {
    LoadSpinner,
    NoDataMessage,
    CollectionLoader,
    TickField,
  },

  props: {
    sale: { type: SaleRecord, required: true },
  },

  data: _ => ({
    isLoaded: false,
    isLoadFailed: false,
    isRemovalMode: false,
    isInvitationsRemoving: false,
    invitations: [],
    firstPageLoader: _ => {},
  }),

  computed: {
    invitationsToRemove () {
      return this.invitations.filter(item => item.shouldBeRemoved)
    },
  },

  created () {
    this.initFirstPageLoader()
  },

  methods: {
    // Public method for calling it via ref attributes
    reloadInvitations () {
      this.initFirstPageLoader()
    },

    initFirstPageLoader () {
      this.firstPageLoader = _ => this.loadInvitations()
    },

    async loadInvitations () {
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

    setInvitations (invitations) {
      this.invitations = invitations.map(item => {
        item.shouldBeRemoved = false
        return item
      })
    },

    concatInvitations (invitations) {
      this.invitations = this.invitations.concat(
        invitations.map(item => {
          item.shouldBeRemoved = false
          return item
        }),
      )
    },

    cancelRemovalMode () {
      this.invitations.forEach(item => {
        item.shouldBeRemoved = false
      })
      this.isRemovalMode = false
    },

    async removeInvitations () {
      this.isInvitationsRemoving = true
      try {
        await api.deleteWithSignature('/invites', {
          data: this.invitationsToRemove.map(item => ({
            type: 'whitelist-invite',
            id: item.id,
          })),
        })
        Bus.success('sale-whitelist.users-removed-msg')
        this.isRemovalMode = false
        this.initFirstPageLoader()
      } catch (e) {
        ErrorHandler.process(e)
      }
      this.isInvitationsRemoving = false
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';

.whitelist-invitations-list__actions-wrp {
  display: flex;
  margin: -1rem;
}

.whitelist-invitations-list__action {
  margin: 1rem;
}

.whitelist-invitations-list__table {
  margin-top: 2rem;
}
</style>
