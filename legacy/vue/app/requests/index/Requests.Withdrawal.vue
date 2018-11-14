<template>
  <div class="withdrawal-requests">
    <md-table md-card class="withdrawal-requests__table">
      <md-table-toolbar class="withdrawal-requests__table-toolbar">
        <div class="withdrawal-requests__select-outer">
          <select-field-object-unchained
            :label="i18n.lbl_asset()"
            v-model="withdrawalState"
            :values="withdrawalStates"
          />
        </div>
      </md-table-toolbar>
      <template v-if="list.length">
        <md-table-row class="withdrawal-requests__row">
          <md-table-head>{{ i18n.lbl_token_code() }}</md-table-head>
          <md-table-head>{{ i18n.lbl_request_state() }}</md-table-head>
          <md-table-head>{{ i18n.lbl_created_at() }}</md-table-head>
          <md-table-head class="withdrawal-requests__hide-md">
            {{ i18n.lbl_updated_at() }}
          </md-table-head>
          <md-table-head><!--Button--></md-table-head>
        </md-table-row>
        <template v-for="(item, i) in list">
          <md-table-row
            class="withdrawal-requests__row"
            @click.native="toggleDetails(i)"
            :key="i">
            <md-table-cell class="withdrawal-requests__table-cell">
              {{ item.tokenName }} ({{ item.tokenCode }})
            </md-table-cell>
            <md-table-cell class="withdrawal-requests__table-cell">
              {{ item.state }}
            </md-table-cell>
            <md-table-cell class="withdrawal-requests__table-cell">
              {{ i18n.d(item.createdAt) }}
            </md-table-cell>
            <md-table-cell
              class="withdrawal-requests__table-cell
                     withdrawal-requests__hide-md">
              {{ i18n.d(item.updatedAt) }}
            </md-table-cell>
            <md-table-cell class="withdrawal-requests__table-cell">
              <md-button
                class="withdrawal-requests__open-details-btn
                       md-icon-button">
                <md-icon v-if="isSelected(i)">keyboard_arrow_up</md-icon>
                <md-icon v-else>keyboard_arrow_down</md-icon>
              </md-button>
            </md-table-cell>
          </md-table-row>
          <md-table-row
            class="th-token-creation__expandable-row"
            v-if="isSelected(i)"
            :key="`selected-${i}`">
            <md-table-cell colspan="7">
              <md-card-content class="md-layout md-gutter">
                <div class="details-column md-layout-item">
                  <details-reader :details="item" />
                </div>
              </md-card-content>
              <md-card-actions>
                <button
                  v-ripple
                  @click="cancelRequest(item.id)"
                  class="app__button-flat"
                  :disabled="!item.isPending || isPending">
                  {{ i18n.lbl_cancel() }}
                </button>
              </md-card-actions>
            </md-table-cell>
          </md-table-row>
        </template>
        <md-table-row v-if="!isLoaded">
          <md-table-cell colspan="7">
            <div>
              <button
                v-ripple
                @click="more"
                class="app__button-flat"
                :disabled="isLoading">
                {{ i18n.lbl_view_more() }}
              </button>
            </div>
          </md-table-cell>
        </md-table-row>
      </template>
      <template v-else>
        <div class="withdrawal-requests__no-requests">
          <no-data-message
            icon-name="trending_up"
            :msg-title="i18n.lbl_no_withdrawal_requests()"
            :msg-message="i18n.lbl_no_withdrawal_requests_desc()" />
        </div>
      </template>
    </md-table>
  </div>
</template>

<script>
import _get from 'lodash/get'
import FormMixin from 'L@/vue/common/mixins/form.mixin'
import NoDataMessage from 'L@/vue/common/messages/NoDataMessage'
import DetailsReader from 'L@/vue/app/common/DetailsReader'

import { mapGetters, mapActions } from 'vuex'
import { i18n } from 'L@/js/i18n'
import {
  documentTypes,
  ASSET_POLICIES_VERBOSE,
  REQUEST_STATES_STR,
  REQUEST_STATES
} from 'L@/js/const/const'
import { vuexTypes } from 'L@/vuex/types'

import { tokensService } from 'L@/js/services/tokens.service'
import { EventDispatcher } from 'L@/js/events/event_dispatcher'
import { ErrorHandler } from 'L@/js/errors/error_handler'

export default {
  components: {
    NoDataMessage,
    DetailsReader
  },
  mixins: [FormMixin],
  data: _ => ({
    i18n,
    documentTypes,
    isLoading: false,
    index: -1,
    ASSET_POLICIES_VERBOSE,
    REQUEST_STATES_STR,
    REQUEST_STATES,
    withdrawalStates: [
      {
        value: '',
        translationId: 'lbl_all'
      },
      {
        value: REQUEST_STATES.pending,
        translationId: 'lbl_pending'
      },
      {
        value: REQUEST_STATES.approved,
        translationId: 'lbl_approved'
      },
      {
        value: REQUEST_STATES.rejected,
        translationId: 'lbl_rejected'
      },
      {
        value: REQUEST_STATES.cancelled,
        translationId: 'lbl_cancelled'
      },
      {
        value: REQUEST_STATES.permanentlyRejected,
        translationId: 'lbl_permanently_rejected'
      }
    ],
    withdrawalState: {
      value: '',
      translationId: 'lbl_all'
    }
  }),
  computed: {
    ...mapGetters([
      vuexTypes.withdrawalRequests
    ]),
    list () {
      return _get(this.withdrawalRequests, 'records', [])
    },
    isLoaded () {
      return _get(this.withdrawalRequests, 'isLoaded')
    }
  },
  watch: {
    'withdrawalState.value' (val) {
      this.loadList({ state: this.withdrawalState.value })
    }
  },
  async created () {
    await this.loadList({ state: this.withdrawalState.value })
    this.$emit('loaded')
  },
  methods: {
    ...mapActions({
      loadList: vuexTypes.GET_USER_WITHDRAWAL_REQUESTS,
      loadNext: vuexTypes.NEXT_USER_WITHDRAWAL_REQUESTS
    }),
    toggleDetails (index) {
      this.index = this.index === index ? -1 : index
    },
    isSelected (i) {
      return this.index === i
    },
    async cancelRequest (requestID) {
      this.disable()
      try {
        await tokensService.cancelTokenCreationRequest({
          requestID: requestID
        })
        this.loadList({ state: this.withdrawalState.value })
        EventDispatcher.dispatchShowSuccessEvent('Cancel request success')
      } catch (error) {
        console.error(error)
        ErrorHandler.processUnexpected(error)
      }
      this.enable()
    },
    async more () {
      this.isLoading = true
      try {
        await this.loadNext()
      } catch (error) {
        console.error(error)
        EventDispatcher.dispatchShowErrorEvent(i18n.th_failed_to_load_tx())
      }
      this.isLoading = false
    },
    getPolicies (item) {
      return item.map(policy => ASSET_POLICIES_VERBOSE[policy]).join(', ')
    },
    getFancyName (item) {
      return item.replace('_', ' ')
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~L@scss/mixins";
  @import "~L@scss/variables";

  $padding-vertical: 20px;
  $padding-horizontal: 25px;
  $padding: $padding-vertical $padding-horizontal;

  .withdrawal-requests {
    width: 100%;
  }

  .withdrawal-requests__table {
    margin: 0 !important;
  }

  .withdrawal-requests__table-toolbar {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;

    @media (max-width: 840px) {
      flex-direction: column;
      padding-top: $padding-vertical;
    }
  }

  .withdrawal-requests__row {
    cursor: pointer;
  }

  .withdrawal-requests__table-cell {
    overflow: hidden;
    white-space: nowrap;

    &--counterparty {
      max-width: 10rem;
    }
    &:last-child {
      text-align: right;
    }
  }

  .withdrawal-requests__open-details-btn {
    margin-right: .65rem;
  }

  .withdrawal-requests__select-outer {
    padding: 5px $padding-horizontal;
  }

  .withdrawal-requests__details {
    padding: $padding;
    max-width: 25rem;
    width: 100%;
  }

  .withdrawal-requests__btn-outer {
    text-align: center;
  }

  .withdrawal-requests__no-requests {
    padding: 0 16px 32px;
    text-align: center;

    p {
      margin-top: 10px;
    }
  }

  .withdrawal-requests__table-title {
    padding: 24px;
    font-size: 24px;
  }

  .withdrawal-requests__no-requests {
    padding: 0 16px 32px;
    text-align: center;

    p {
      margin-top: 10px;
    }
  }

  .token-icon {
    width: 142px;
    height: 142px;
    border-radius: 50%;
    font-size: 48px;
    background-color: $col-app-background;
    margin-right: 27px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: none;

    @include respond-to(small) {
      margin-right: 0;
      margin-bottom: 12px;
    }
  }

  .details-column {
    margin-right: .2rem;
  }

  .withdrawal-requests__hide-md {
    @include respond-to(medium) {
      display: none;
    }
  }
</style>
