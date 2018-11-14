<template>
  <div class="tx-history">
    <div class="app__card">
      <div class="tx-history__table-toolbar">
        <div class="tx-history__select-outer">
          <select-field-custom
            :label="i18n.lbl_asset()"
            v-model="tokenCode"
            :values="tokens" />
        </div>
      </div>
      <md-table class="tx-history__table">
        <template v-if="tokenCode && list.length">
          <md-table-row class="tx-history__row">
            <md-table-head>{{ i18n.lbl_date() }}</md-table-head>
            <md-table-head>{{ i18n.lbl_tx_type() }}</md-table-head>
            <md-table-head>{{ i18n.lbl_status() }}</md-table-head>
            <md-table-head>{{ i18n.lbl_asset() }}</md-table-head>
            <md-table-head>{{ i18n.lbl_amount() }}</md-table-head>
            <md-table-head>{{ i18n.lbl_counterparty() }}</md-table-head>
            <md-table-head><!--Button--></md-table-head>
          </md-table-row>

          <template v-for="(tx, i) in list">
            <md-table-row
              class="tx-history__row"
              @click.native="toggleDetails(i)"
              :key="`tx-history-row-${i}`">
              <md-table-cell class="tx-history__table-cell">
                {{ tx.date }}
              </md-table-cell>
              <md-table-cell class="tx-history__table-cell">
                {{ tx.name }}
              </md-table-cell>
              <md-table-cell class="tx-history__table-cell">
                {{ tx.state }}
              </md-table-cell>
              <md-table-cell class="tx-history__table-cell">
                {{ tx.asset }}
              </md-table-cell>
              <md-table-cell class="tx-history__table-cell">
                {{ tx.amount }}
              </md-table-cell>
              <md-table-cell
                class="tx-history__table-cell
                      tx-history__table-cell--counterparty">
                <email-getter :id="tx.counterparty" />
              </md-table-cell>

              <md-table-cell>
                <md-button class="tx-history__open-details-btn md-icon-button">
                  <md-icon v-if="isSelected(i)">keyboard_arrow_up</md-icon>
                  <md-icon v-else>keyboard_arrow_down</md-icon>
                </md-button>
              </md-table-cell>
            </md-table-row>

            <md-table-row
              class="tx-history__expandable-row"
              v-if="isSelected(i)"
              :key="`history-index-${i}-${i}`">
              <md-table-cell colspan="7">
                <tx-details
                  class="tx-history__details"
                  :tx="tx" />
              </md-table-cell>
            </md-table-row>
          </template>

          <md-table-row v-if="!isLoaded">
            <md-table-cell colspan="7">
              <div class="tx-history__more-btn-outer">
                <button
                  v-ripple
                  @click="more"
                  class="app__button-flat"
                  :disabled="isLoading">
                  {{ i18n.lbl_more() }}
                </button>
              </div>
            </md-table-cell>
          </md-table-row>
        </template>

        <template v-else>
          <div class="tx-history__no-transactions">
            <md-icon class="md-size-4x">trending_up</md-icon>
            <h2>{{ i18n.th_no_transaction_history() }}</h2>
            <p>{{ i18n.th_here_will_be_the_list() }}</p>
          </div>
        </template>
      </md-table>
    </div>
  </div>
</template>

<script>
import TxDetails from './History.TxDetails'
import SelectFieldCustom from 'L@/vue/common/fields/SelectFieldCustom'

import { mapGetters, mapActions } from 'vuex'
import { EventDispatcher } from '../../../../js/events/event_dispatcher'
import { vuexTypes } from '../../../../vuex/types'
import { RecordTypes } from '../../../../js/records/types'
import { i18n } from '../../../../js/i18n/index'
import get from 'lodash/get'
import EmailGetter from 'L@/vue/app/common/EmailGetter'

export default {
  name: 'history-index',
  components: {
    TxDetails,
    SelectFieldCustom,
    EmailGetter
  },
  data: _ => ({
    isLoading: false,
    tokenCode: null,
    index: -1,
    i18n
  }),
  computed: {
    ...mapGetters([
      vuexTypes.transactions,
      vuexTypes.userAcquiredTokens
    ]),
    list () {
      return (get(this.transactions, `${this.tokenCode}.records`) || [])
        .reduce((list, item) => {
          if (item instanceof RecordTypes.MatchRecord) {
            item.transactions.forEach(tx => { list.push(tx) })
            return list
          }
          list.push(item)
          return list
        }, [])
    },
    isLoaded () {
      return get(this.transactions, `${this.tokenCode}.isLoaded`)
    },
    tokens () {
      return this.userAcquiredTokens.map(token => token.code)
    }
  },
  watch: {
    tokenCode (code) {
      this.loadList(code)
    }
  },
  async created () {
    this.tokenCode = this.$route.params.tokenCode || this.tokens[0] || null
    if (this.tokenCode) {
      await this.loadList(this.tokenCode)
    }
  },
  methods: {
    ...mapActions({
      loadList: vuexTypes.GET_TX_LIST,
      loadNext: vuexTypes.NEXT_TX_LIST
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
        await this.loadNext(this.tokenCode)
      } catch (e) {
        console.error(e)
        EventDispatcher.dispatchShowErrorEvent(i18n.th_failed_to_load_tx())
      }
      this.isLoading = false
    }
  }
}
</script>

<style lang="scss">
  @import '../../../../scss/variables';

  $padding-vertical: 20px;
  $padding-horizontal: 25px;
  $padding: $padding-vertical $padding-horizontal;

  .tx-history {
    width: 100%;
    padding: 0 12px;
  }

  .tx-history__table {
    margin: 0 !important;
  }

  .tx-history__table-toolbar {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;

    @media (max-width: 840px) {
      flex-direction: column;
      padding-top: $padding-vertical;
    }
  }

  .tx-history__row {
    cursor: pointer;
  }

  .tx-history__table-cell {
    overflow: hidden;
    white-space: nowrap;

    &--counterparty {
      max-width: 10rem;
    }

    & > .md-table-cell-container {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  .tx-history__select-outer {
    padding: 5px $padding-horizontal;
  }

  .tx-history__details {
    padding: $padding;
    max-width: 25rem;
    width: 100%;
  }

  .tx-history__more-btn-outer {
    text-align: center;
  }

  .tx-history__no-transactions {
    padding: 0 16px 32px;
    text-align: center;

    p {
      margin-top: 10px;
    }
  }

  .tx-history__table-title {
    padding: 24px;
    font-size: 24px;
  }
</style>
