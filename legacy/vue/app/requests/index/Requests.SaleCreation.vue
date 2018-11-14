<template>
  <div class="tx-sale-creation">
    <md-table md-card class="tx-sale-creation__table">
      <md-table-toolbar class="tx-sale-creation__table-toolbar">
        <div
          class="tx-sale-creation__select-outer"
          v-if="accountOwnedTokenCodes.length">
          <select-field-custom
            :label="i18n.lbl_asset()"
            v-model="tokenCode"
            :values="accountOwnedTokenCodes" />
        </div>
      </md-table-toolbar>
      <template v-if="tokenCode && list.length">
        <md-table-row class="tx-sale-creation__row">
          <md-table-head>{{ i18n.lbl_sale_name() }}</md-table-head>
          <md-table-head>{{ i18n.lbl_token_code() }}</md-table-head>
          <md-table-head>{{ i18n.lbl_request_state() }}</md-table-head>
          <md-table-head>{{ i18n.lbl_created_at() }}</md-table-head>
          <md-table-head class="tx-sale-creation__hide-md">
            {{ i18n.lbl_updated_at() }}
          </md-table-head>
          <md-table-head><!--Button--></md-table-head>
        </md-table-row>
        <template v-for="(item, i) in list">
          <md-table-row
            class="tx-sale-creation__row"
            @click.native="toggleDetails(i)"
            :key="i">
            <md-table-cell class="tx-sale-creation__table-cell">
              {{ item.saleName }}
            </md-table-cell>
            <md-table-cell class="tx-sale-creation__table-cell">
              {{ item.tokenCode }}
            </md-table-cell>
            <md-table-cell class="tx-sale-creation__table-cell">
              {{ item.requestState }}
            </md-table-cell>
            <md-table-cell class="tx-sale-creation__table-cell">
              {{ i18n.d(item.createdAt) }}
            </md-table-cell>
            <md-table-cell
              class="tx-sale-creation__table-cell
                     tx-sale-creation__hide-md">
              {{ i18n.d(item.updatedAt) }}
            </md-table-cell>

            <md-table-cell class="tx-sale-creation__table-cell">
              <md-button
                class="tx-sale-creation__open-details-btn
                       md-icon-button">
                <md-icon v-if="isSelected(i)">keyboard_arrow_up</md-icon>
                <md-icon v-else>keyboard_arrow_down</md-icon>
              </md-button>
            </md-table-cell>
          </md-table-row>

          <md-table-row
            class="tx-sale-creation__expandable-row"
            v-if="isSelected(i)"
            :key="`selected-${i}`">
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
                    v-if="item.saleLogoUrl"
                    :src="item.saleLogoUrl"
                    :alt="documentTypes.fundLogo">
                  <div class="token-icon" v-else>
                    {{ item.saleName.substr(0, 1).toUpperCase() }}
                  </div>
                </div>
                <div class="details-column md-layout-item">
                  <detail
                    prop="Request type"
                    :value="`${ item.requestType }`" />
                  <detail
                    prop="Token name"
                    :value="`${item.tokenCode}`" />
                  <detail
                    :prop="`${i18n.sale_start_time()}`"
                    :value="`${i18n.d(item.startTime)}`" />
                  <detail
                    :prop="`${i18n.sale_close_time()}`"
                    :value="`${i18n.d(item.endTime)}`" />
                  <detail
                    :prop="`${i18n.sale_soft_cap()}`"
                    :value="
                      `${i18n.c(item.softCap)} ${item.defaultQuoteAsset}`
                    "
                  />
                  <detail
                    :prop="`${i18n.sale_hard_cap()}`"
                    :value="
                      `${i18n.c(item.hardCap)} ${item.defaultQuoteAsset}`
                    "
                  />
                  <detail
                    :prop="`
                      ${i18n.sale_base_asset_hard_cap_to_sell({
                        asset: item.tokenCode
                    })}
                    `"
                    :value="`
                      ${i18n.c(item.baseAssetForHardCap)} ${item.tokenCode}
                    `"
                  />
                  <detail
                    :prop="`${i18n.sale_quote_assets()}`"
                    :value="`${item.quoteAssets}`" />
                  <detail :prop="`${i18n.sale_fund_video()}`">
                    <template
                      v-if="checkIsValidYoutubeId(item.youtubeVideoUrl)">
                      <a :href="item.youtubeVideoUrl" target="_blank">
                        Open video
                      </a>
                    </template>
                    <template v-else>
                      –
                    </template>
                  </detail>
                  <detail
                    :prop="`${i18n.sale_short_description()}`"
                    :value="`${item.shortDescription}`" />
                  <!-- eslint-disable max-len -->
                  <detail
                    :prop="`${i18n.lbl_reject_message()}`"
                    v-if="item.requestState === REQUEST_STATES_STR.rejected ||
                    item.requestState === REQUEST_STATES_STR.permanentlyRejected"
                    :value="`${item.rejectReason}`" />
                    <!-- eslint-enable max-len -->
                </div>
              </md-card-content>
              <md-card-actions>
                <template v-if="item.isApproved">
                  <md-button
                    class="md-primary"
                    @click="goFundDetails(item.tokenCode)">
                    {{ i18n.lbl_view_sale() }}
                  </md-button>
                </template>
                <button
                  v-ripple
                  @click="cancelRequest(item.id)"
                  class="app__button-flat"
                  :disabled="!item.isPending || isPending">
                  {{ i18n.lbl_cancel() }}
                </button>
                <router-link
                  :to="{name: 'sale-creation.index', params: { id: item.id }}"
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
        <div class="tx-sale-creation__no-requests">
          <no-data-message
            icon-name="trending_up"
            :msg-title="i18n.sale_no_creation_requests()"
            :msg-message="i18n.sale_no_creation_requests_desc()" />
        </div>
      </template>
    </md-table>
  </div>
</template>

<script>
import FormMixin from '../../../common/mixins/form.mixin'
import Detail from '../../common/Detail.Row'
import _get from 'lodash/get'

import { mapGetters, mapActions } from 'vuex'
import { i18n } from 'L@/js/i18n'
import { REQUEST_STATES_STR, documentTypes } from 'L@/js/const/const'
import { vuexTypes } from 'L@/vuex/types'
import { vueRoutes } from 'L@/vue-router/const'
import { EventDispatcher } from 'L@/js/events/event_dispatcher'
import NoDataMessage from 'L@/vue/common/messages/NoDataMessage'

import { salesService } from 'L@/js/services/sales.service'
import { ErrorHandler } from 'L@/js/errors/error_handler'

export default {
  components: { Detail, NoDataMessage },
  mixins: [FormMixin],
  data: _ => ({
    i18n,
    tokenCode: null,
    isLoading: false,
    index: -1,
    documentTypes,
    REQUEST_STATES_STR
  }),
  computed: {
    ...mapGetters([
      vuexTypes.saleCreationRequests,
      vuexTypes.accountOwnedTokenCodes
    ]),
    list () {
      return _get(this.saleCreationRequests, `${this.tokenCode}.records`, [])
    },
    isLoaded () {
      return _get(this.saleCreationRequests, `${this.tokenCode}.isLoaded`)
    }
  },
  watch: {
    tokenCode (code) {
      this.loadList(code)
      this.index = -1
    }
  },
  async created () {
    this.tokenCode = this.accountOwnedTokenCodes[0] || null
    if (this.tokenCode) {
      await this.loadList(this.tokenCode)
    }
  },
  methods: {
    ...mapActions({
      loadList: vuexTypes.GET_USER_SALE_CREATION_REQUESTS,
      loadNext: vuexTypes.NEXT_USER_SALE_CREATION_REQUESTS
    }),

    async cancelRequest (requestID) {
      this.disable()
      try {
        await salesService.cancelSaleCreationRequest({
          requestID: requestID
        })
        this.loadList(this.tokenCode)
        EventDispatcher.dispatchShowSuccessEvent('Cancel request success')
      } catch (error) {
        console.error(error)
        ErrorHandler.processUnexpected(error)
      }
      this.enable()
    },

    checkIsValidYoutubeId (youtubeId) {
      // if user doesn't enter the youtube video id when creating the sale
      // method _getYoutubeVideoUrl don't handle this so we have link like
      // this: https://www.youtube.com/watch?v=
      // With regexp below we handle this empty link
      const regexp = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/]{11})/i
      return regexp.test(youtubeId)
    },

    toggleDetails (index) {
      this.index = this.index === index ? -1 : index
    },

    isSelected (i) {
      return this.index === i
    },

    async more () {
      this.isLoading = true
      try {
        await this.loadNext(this.tokenCode)
      } catch (e) {
        console.error(e)
        EventDispatcher.dispatchShowErrorEvent(i18n.th_failed_to_load_tx())
      }
      this.isLoading = false
    },

    async goFundDetails (code) {
      const sale = await salesService.loadSaleByTokenCode(code)
      this.$router.push({
        ...vueRoutes.saleDetails,
        params: { id: sale.id }
      })
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

  .tx-sale-creation {
    width: 100%;
  }

  .tx-sale-creation__table {
    margin: 0 !important;
  }

  .tx-sale-creation__table-toolbar {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;

    @media (max-width: 840px) {
      flex-direction: column;
      padding-top: $padding-vertical;
    }
  }

  .tx-sale-creation__row {
    cursor: pointer;
  }

  .tx-sale-creation__table-cell {
    overflow: hidden;
    white-space: nowrap;

    &--counterparty {
      max-width: 10rem;
    }
    &:last-child {
      text-align: right;
    }
  }

  .tx-sale-creation__open-details-btn {
    margin-right: .65rem
  }

  .tx-sale-creation__select-outer {
    padding: 5px $padding-horizontal;
  }

  .tx-sale-creation__details {
    padding: $padding;
    max-width: 25rem;
    width: 100%;
  }

  .tx-sale-creation__btn-outer {
    text-align: center;
  }

  .tx-sale-creation__no-requests {
    padding: 0 16px 32px;
    text-align: center;

    p {
      margin-top: 10px;
    }
  }

  .tx-sale-creation__table-title {
    padding: 24px;
    font-size: 24px;
  }

  .tx-sale-creation__no-requests {
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

  .tx-sale-creation__hide-md {
    @include respond-to(medium) {
      display: none;
    }
  }
</style>
