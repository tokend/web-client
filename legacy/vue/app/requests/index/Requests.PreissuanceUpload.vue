<template>
  <div class="tx-preissuance-upload">
    <md-table md-card class="tx-preissuance-upload__table">
      <template v-if="list.length">
        <md-table-row class="tx-preissuance-upload__row">
          <md-table-head>{{ i18n.lbl_token_code() }}</md-table-head>
          <md-table-head>{{ i18n.preis_amount() }}</md-table-head>
          <md-table-head>{{ i18n.lbl_request_state() }}</md-table-head>
          <md-table-head>{{ i18n.lbl_created_at() }}</md-table-head>
          <md-table-head><!--Button--></md-table-head>
        </md-table-row>
        <template v-for="(item, i) in list">
          <md-table-row class="tx-preissuance-upload__row" :key="i">
            <md-table-cell class="tx-preissuance-upload__table-cell">
              {{ item.asset }}
            </md-table-cell>
            <md-table-cell class="tx-preissuance-upload__table-cell">
              {{ i18n.c(item.amount) }}
            </md-table-cell>
            <md-table-cell class="tx-preissuance-upload__table-cell">
              {{ item.state }}
            </md-table-cell>
            <md-table-cell class="tx-preissuance-upload__table-cell">
              {{ i18n.d(item.createdAt) }}
            </md-table-cell>
            <md-table-cell class="tx-token-creation__table-cell">
              <md-button
                class="tx-token-creation__open-details-btn
                       md-icon-button"
                v-if="item.rejectReason">
                <md-icon v-if="isSelected(i)">keyboard_arrow_up</md-icon>
                <md-icon v-else>keyboard_arrow_down</md-icon>
              </md-button>
            </md-table-cell>
          </md-table-row>
          <md-table-row
            class="th-preissuance-upload__expandable-row"
            v-if="isSelected(i)"
            :key="'selected-'+i">
            <md-table-cell colspan="7">
              <md-card-content class="md-layout md-gutter">
                <div class="details-column md-layout-item">
                  <detail
                    prop="Reject reason"
                    :value="`${item.rejectReason}`" />
                </div>
              </md-card-content>
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
        <div class="tx-preissuance-upload__no-requests">
          <no-data-message
            icon-name="trending_up"
            :msg-title="i18n.preis_no_token_creation_requests()"
            :msg-message="i18n.preis_no_token_creation_requests_desc()" />
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
import { vuexTypes } from 'L@/vuex/types'

import { EventDispatcher } from 'L@/js/events/event_dispatcher'

export default {
  components: { Detail, NoDataMessage },
  mixins: [FormMixin],
  data: _ => ({
    i18n,
    isLoading: false,
    index: -1
  }),
  computed: {
    ...mapGetters([
      vuexTypes.preIssuanceUploadRequests
    ]),
    list () {
      return _get(this.preIssuanceUploadRequests, 'records', [])
    },
    isLoaded () {
      return _get(this.preIssuanceUploadRequests, 'isLoaded')
    }
  },
  async created () {
    await this.loadList()
  },
  methods: {
    ...mapActions({
      loadList: vuexTypes.GET_USER_PREISSUANCE_UPLOAD_REQUESTS,
      loadNext: vuexTypes.NEXT_USER_PREISSUANCE_UPLOAD_REQUESTS
    }),

    toggleDetails (index) {
      this.index = this.index === index ? -1 : index
    },

    isSelected (i) {
      return this.index === i
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

  .tx-preissuance-upload {
    width: 100%;
  }

  .tx-preissuance-upload__table {
    margin: 0 !important;
  }

  .tx-preissuance-upload__table-toolbar {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;

    @media (max-width: 840px) {
      flex-direction: column;
      padding-top: $padding-vertical;
    }
  }

  .tx-preissuance-upload__row {
    cursor: pointer;
  }

  .tx-preissuance-upload__table-cell {
    overflow: hidden;
    white-space: nowrap;

    &--counterparty {
      max-width: 10rem;
    }
  }

  .tx-preissuance-upload__open-details-btn {
    margin-right: .65rem;
  }

  .tx-preissuance-upload__select-outer {
    padding: 5px $padding-horizontal;
  }

  .tx-preissuance-upload__details {
    padding: $padding;
    max-width: 25rem;
    width: 100%;
  }

  .tx-preissuance-upload__btn-outer {
    text-align: center;
  }

  .tx-preissuance-upload__no-requests {
    padding: 0 16px 32px;
    text-align: center;

    p {
      margin-top: 10px;
    }
  }

  .tx-preissuance-upload__table-title {
    padding: 24px;
    font-size: 24px;
  }

  .tx-preissuance-upload__no-requests {
    padding: 0 16px 32px;
    text-align: center;

    p {
      margin-top: 10px;
    }
  }

  .details-column {
    margin-right: .2rem;
  }
</style>
