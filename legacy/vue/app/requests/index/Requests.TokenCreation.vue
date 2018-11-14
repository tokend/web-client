<template>
  <div class="tx-token-creation">
    <md-table md-card class="tx-token-creation__table">
      <template v-if="list.length">
        <md-table-row class="tx-token-creation__row">
          <md-table-head>{{ i18n.lbl_token_code() }}</md-table-head>
          <md-table-head>{{ i18n.lbl_request_state() }}</md-table-head>
          <md-table-head>{{ i18n.lbl_created_at() }}</md-table-head>
          <md-table-head class="tx-token-creation__hide-md">
            {{ i18n.lbl_updated_at() }}
          </md-table-head>
          <md-table-head><!--Button--></md-table-head>
        </md-table-row>
        <template v-for="(item, i) in list">
          <md-table-row
            class="tx-token-creation__row"
            @click.native="toggleDetails(i)"
            :key="i">
            <md-table-cell class="tx-token-creation__table-cell">
              {{ item.reference }}
            </md-table-cell>
            <md-table-cell class="tx-token-creation__table-cell">
              {{ item.state }}
            </md-table-cell>
            <md-table-cell class="tx-token-creation__table-cell">
              {{ i18n.d(item.createdAt) }}
            </md-table-cell>
            <md-table-cell
              class="tx-token-creation__table-cell
                     tx-token-creation__hide-md">
              {{ i18n.d(item.updatedAt) }}
            </md-table-cell>
            <md-table-cell class="tx-token-creation__table-cell">
              <md-button
                class="tx-token-creation__open-details-btn
                       md-icon-button">
                <md-icon v-if="isSelected(i)">keyboard_arrow_up</md-icon>
                <md-icon v-else>keyboard_arrow_down</md-icon>
              </md-button>
            </md-table-cell>
          </md-table-row>
          <md-table-row
            class="th-token-creation__expandable-row"
            v-if="isSelected(i)"
            :key="'selected-'+i">
            <md-table-cell colspan="7">
              <md-card-content class="md-layout md-gutter">
                <div
                  class="icon-column
                         md-layout-item
                         md-size-35
                         md-layout
                         md-alignment-center-center">
                  <img
                    class="token-icon"
                    v-if="item.logoUrl"
                    :src="item.logoUrl"
                    :alt="documentTypes.tokenIcon">
                  <div class="token-icon" v-else>
                    {{ item.reference.substr(0, 1).toUpperCase() }}
                  </div>
                </div>
                <div class="details-column md-layout-item">
                  <detail
                    prop="Request type"
                    :value="`${getFancyName(item.details.request_type)}`" />
                  <detail
                    prop="Max issuance amount"
                    :value="`${i18n.c(item.maxIssuanceAmount)}`"
                    v-if="item.details.request_type !== 'asset_update'" />
                  <detail
                    prop="Initial preissued amount"
                    :value="`${i18n.c(item.initialPreissuedAmount)}`"
                    v-if="item.details.request_type !== 'asset_update'" />
                  <detail
                    prop="Preissued asset signer"
                    :value="`${item.signer}`" />
                  <detail
                    prop="Token name"
                    :value="`${item.tokenName}`" />
                  <detail
                    prop="Offering memorandum"
                    v-if="item.termsUrl"
                    :value="''">
                    <a href="${item.termsUrl}" target="_blank">
                      Open file
                    </a>
                  </detail>
                  <detail prop="Offering memorandum" v-else />
                  <detail
                    prop="Policies"
                    :value="`${getPolicies(item.policies)}`" />
                  <detail
                    prop="Reject reason"
                    v-if="item.isRejected || item.isPermanentlyRejected"
                    :value="`${item.rejectReason}`" />
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
                <router-link
                  :to="{
                    name: 'token-creation.index',
                    params: { id: item.id }
                  }"
                  tag="button"
                  v-ripple
                  class="app__button-flat"
                  :disabled="
                    (!item.isPending && !item.isRejected) || isPending
                  "
                >
                  {{ i18n.lbl_update() }}
                </router-link>
              </md-card-actions>
            </md-table-cell>
          </md-table-row>
        </template>
        <md-table-row v-if="!isLoaded">
          <md-table-cell colspan="7">
            <div class="tx-history__btn-outer">
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
        <div class="tx-token-creation__no-requests">
          <no-data-message
            icon-name="trending_up"
            :msg-title="i18n.lbl_no_token_creation_requests()"
            :msg-message="i18n.lbl_no_token_creation_requests_desc()" />
        </div>
      </template>
    </md-table>
  </div>
</template>

<script>
import FormMixin from '../../../common/mixins/form.mixin'
import Detail from '../../common/Detail.Row'
import _get from 'lodash/get'
import NoDataMessage from 'L@/vue/common/messages/NoDataMessage'

import { mapGetters, mapActions } from 'vuex'
import { i18n } from 'L@/js/i18n'
import { documentTypes, ASSET_POLICIES_VERBOSE } from 'L@/js/const/const'
import { vuexTypes } from 'L@/vuex/types'

import { tokensService } from 'L@/js/services/tokens.service'
import { EventDispatcher } from 'L@/js/events/event_dispatcher'
import { ErrorHandler } from 'L@/js/errors/error_handler'

export default {
  components: { Detail, NoDataMessage },
  mixins: [FormMixin],
  data: _ => ({
    i18n,
    documentTypes,
    isLoading: false,
    index: -1,
    ASSET_POLICIES_VERBOSE
  }),
  computed: {
    ...mapGetters([
      vuexTypes.tokenCreationRequests
    ]),
    list () {
      return _get(this.tokenCreationRequests, 'records', [])
    },
    isLoaded () {
      return _get(this.tokenCreationRequests, 'isLoaded')
    }
  },
  async created () {
    await this.loadList()
    this.$emit('loaded')
  },
  methods: {
    ...mapActions({
      loadList: vuexTypes.GET_USER_TOKENS_CREATION_REQUESTS,
      loadNext: vuexTypes.NEXT_USER_TOKENS_CREATION_REQUESTS
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
        this.loadList()
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
      } catch (e) {
        console.error(e)
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

  .tx-token-creation {
    width: 100%;
  }

  .tx-token-creation__table {
    margin: 0 !important;
  }

  .tx-token-creation__table-toolbar {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;

    @media (max-width: 840px) {
      flex-direction: column;
      padding-top: $padding-vertical;
    }
  }

  .tx-token-creation__row {
    cursor: pointer;
  }

  .tx-token-creation__table-cell {
    overflow: hidden;
    white-space: nowrap;

    &--counterparty {
      max-width: 10rem;
    }
    &:last-child {
      text-align: right;
    }
  }

  .tx-token-creation__open-details-btn {
    margin-right: .65rem;
  }

  .tx-token-creation__select-outer {
    padding: 5px $padding-horizontal;
  }

  .tx-token-creation__details {
    padding: $padding;
    max-width: 25rem;
    width: 100%;
  }

  .tx-token-creation__btn-outer {
    text-align: center;
  }

  .tx-token-creation__no-requests {
    padding: 0 16px 32px;
    text-align: center;

    p {
      margin-top: 10px;
    }
  }

  .tx-token-creation__table-title {
    padding: 24px;
    font-size: 24px;
  }

  .tx-token-creation__no-requests {
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

  .tx-token-creation__hide-md {
    @include respond-to(medium) {
      display: none;
    }
  }
</style>
