<template>
  <div class="whitelist-invitations">
    <template v-if="isLoaded">
      <template v-if="invites.length">
        <div class="whitelist-invitations__actions-wrp">
          <template v-if="isDeletingMode">
            <button
              class="app__button-raised
                     app__button-raised--danger
                     whitelist-invitations__action"
              @click="removeInvites"
              :disabled="!invitesToRemove.length || isInvitesRemoving"
            >
              <template v-if="isInvitesRemoving">
                {{ 'sale-whitelist.processing-btn' | globalize }}
              </template>

              <template v-else>
                {{ 'sale-whitelist.confirm-removal-btn' | globalize }}
              </template>
            </button>

            <button
              class="app__button-raised whitelist-invitations__action"
              @click="cancelDeleting"
              :disabled="isInvitesRemoving"
            >
              {{ 'sale-whitelist.cancel-removal-btn' | globalize }}
            </button>
          </template>

          <template v-else>
            <button
              class="app__button-raised whitelist-invitations__action"
              @click="isDeletingMode = true"
            >
              {{ 'sale-whitelist.edit-invitations-btn' | globalize }}
            </button>
          </template>
        </div>

        <div class="app__table whitelist-invitations__table">
          <table>
            <thead>
              <th v-if="isDeletingMode" />
              <th>{{ 'sale-whitelist.email-th' | globalize }}</th>
              <th>{{ 'sale-whitelist.registered-th' | globalize }}</th>
            </thead>
            <tbody>
              <tr
                v-for="invite in invites"
                :key="invite.id"
              >
                <td v-if="isDeletingMode">
                  <tick-field v-model="invite.isDeleting">
                    &nbsp;
                  </tick-field>
                </td>
                <td>
                  {{ invite.email }}
                </td>
                <td>
                  <template v-if="invite.accounts">
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
        :title="'sale-whitelist.no-unregistered-users-title' | globalize"
        :message="'sale-whitelist.no-unregistered-users-msg' | globalize"
      />
    </template>

    <template v-else-if="isLoadFailed">
      <p class="whitelist-invitations-msg">
        {{ 'sale-whitelist.loading-error-msg' | globalize }}
      </p>
    </template>

    <template v-else>
      <load-spinner message-id="sale-whitelist.loading-msg" />
    </template>

    <div class="whitelist-invitations__collection-loader-wrp">
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
import TickField from '@/vue/fields/TickField'

import { api } from '@/api'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { Bus } from '@/js/helpers/event-bus'

import { SaleRecord } from '@/js/records/entities/sale.record'

const EVENTS = {
  shouldUpdate: 'update:shouldUpdate',
}

export default {
  name: 'whitelist-invitations',
  components: {
    LoadSpinner,
    NoDataMessage,
    CollectionLoader,
    TickField,
  },

  props: {
    sale: { type: SaleRecord, required: true },
    shouldUpdate: { type: Boolean, default: false },
  },

  data: _ => ({
    isLoaded: false,
    isLoadFailed: false,
    isDeletingMode: false,
    isInvitesRemoving: false,
    invites: [],
    firstPageLoader: _ => {},
  }),

  computed: {
    invitesToRemove () {
      return this.invites
        .filter(item => item.isDeleting)
        .map(item => ({
          type: 'whitelist-invite',
          id: item.id,
        }))
    },
  },

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
      this.invites = invites.map(item => {
        item.isDeleting = false
        return item
      })
    },

    concatInvites (invites) {
      this.invites = this.invites.concat(
        invites.map(item => {
          item.isDeleting = false
          return item
        })
      )
    },

    cancelDeleting () {
      this.invites.forEach(item => {
        item.isDeleting = false
      })
      this.isDeletingMode = false
    },

    async removeInvites () {
      this.isInvitesRemoving = true
      try {
        await api.deleteWithSignature('/invites', {
          data: this.invitesToRemove,
        })
        Bus.success('sale-whitelist.users-removed-msg')
        this.isDeletingMode = false
        this.initFirstPageLoader()
      } catch (e) {
        ErrorHandler.process(e)
      }
      this.isInvitesRemoving = false
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';

.whitelist-invitations__icon {
  &:before {
    font-size: 2.4rem;
  }

  &--present { color: $col-success; }
  &--absent { color: $col-error; }
}

.whitelist-invitations__actions-wrp {
  display: flex;
  margin: -1rem;
}

.whitelist-invitations__action {
  margin: 1rem;
}

.whitelist-invitations__table {
  margin-top: 2rem;
}
</style>
