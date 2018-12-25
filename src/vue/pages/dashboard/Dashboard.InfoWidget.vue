<template>
  <div class="info-widget">
    <template v-if="list.length">
      <div class="info-widget__title">
        {{ 'dashboard.activity' | globalize }}
      </div>
      <div class="info-widget__list-wrapper">
        <div
          class="info-widget__list"
          v-table-scroll-shadow>
          <div class="info-widget__list-header">
            <div
              class="info-widget__list-header-item
                     info-widget__list-header-item--date">
              {{ 'dashboard.date' | globalize }}
            </div>
            <div
              class="info-widget__list-header-item
                     info-widget__list-header-item--type">
              {{ 'dashboard.transaction-type' | globalize }}
            </div>
            <div
              class="info-widget__list-header-item
                     info-widget__list-header-item--asset">
              {{ 'dashboard.asset' | globalize }}
            </div>
            <div
              class="info-widget__list-header-item
                     info-widget__list-header-item--amount">
              {{ 'dashboard.amount' | globalize }}
            </div>
            <div
              class="info-widget__list-header-item
                     info-widget__list-header-item--counterparty">
              {{ 'dashboard.counterparty' | globalize }}
            </div>
            <div
              class="info-widget__list-header-item
                     info-widget__list-header-item--status">
              {{ 'dashboard.status' | globalize }}
            </div>
            <div
              class="info-widget__list-header-item
                     info-widget__list-header-item--btn" />
          </div>
          <div class="info-widget__list-body">
            <template v-for="(tx, i) in list">
              <div
                class="info-widget__list-body-elem"
                v-if="i < transactionsToShow"
                :key="`activity-item-${i}`"
                :class="`info-widget__list-body-elem--${tx.state}`">
                <div class="info-widget__list-body-row">
                  <div
                    :title="tx.date"
                    class="info-widget__list-body-item
                           info-widget__list-body-item--date">
                    {{ tx.date | formatDateDMY }}
                  </div>
                  <div
                    :title="tx.name"
                    class="info-widget__list-body-item
                           info-widget__list-body-item--type">
                    {{ tx.name }}
                  </div>
                  <div
                    :title="tx.asset"
                    class="info-widget__list-body-item
                           info-widget__list-body-item--asset">
                    {{ tx.asset }}
                  </div>
                  <div
                    :title="tx.direction"
                    class="info-widget__list-body-item
                           info-widget__list-body-item--amount">
                    {{ tx.direction === 'in' ? '+' : '-' }}{{ tx.amount }}
                  </div>
                  <div
                    :title="tx.counterparty"
                    class="info-widget__list-body-item
                           info-widget__list-body-item--counterparty">
                    <email-getter :id="tx.counterparty" />
                  </div>
                  <div
                    :title="tx.state"
                    class="info-widget__list-body-item
                           info-widget__list-body-item--status">
                    {{ tx.state }}
                  </div>
                  <div
                    class="info-widget__list-body-item
                           info-widget__list-body-item--btn">
                    <button
                      class="info-widget__list-body-item-btn"
                      @click="toggleDetails(i)">
                      <md-icon
                        class="info-widget__list-body-item-icon"
                        :class="{
                          'info-widget__list-body-item-icon--active':
                            isSelected(i)
                        }"
                      >
                        keyboard_arrow_down
                      </md-icon>
                    </button>
                  </div>
                </div>
                <div
                  class="info-widget__list-body-row
                         info-widget__list-body-row--details"
                  v-if="isSelected(i)">
                  <record-details-viewer
                    class="info-widget__list-body-row-details"
                    :tx="tx"
                  />
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <no-data-message
        icon-name="trending_up"
        :msg-title="'dashboard.no-transaction-history' | globalize"
        :msg-message="'dashboard.here-will-transactions-list' | globalize"
      />
    </template>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
// FIXME: change it to actual
import { vuexTypes } from 'L@/vuex/types'
// FIXME: change it to actual
import { RecordTypes } from 'L@/js/records/types'
import { PricesHelper } from '@/js/helpers/prices'
// FIXME: change it to actual
import { DEFAULT_CONVERSION_ASSET } from 'L@/js/const/configs.const'
import { TX_STATES } from '@/js/const/transaction-statuses.const'
import NoDataMessage from '@/vue/common/NoDataMessage'
import RecordDetailsViewer from '@/vue/common/RecordDetailsViewer'
// FIXME: change it to actual
import EmailGetter from 'L@/vue/app/common/EmailGetter'
import get from 'lodash/get'

export default {
  name: 'info-widget',
  components: {
    NoDataMessage,
    RecordDetailsViewer,
    EmailGetter
  },
  props: {
    currentAsset: { type: String, required: true }
  },
  data: () => ({
    transactionsToShow: 10,
    DEFAULT_CONVERSION_ASSET,
    TX_STATES,
    index: -1
  }),
  computed: {
    ...mapGetters([
      vuexTypes.transactions,
      vuexTypes.userWalletTokens
    ]),
    list () {
      return (get(this.transactions, `${this.currentAsset}.records`) || [])
        .reduce((list, item) => {
          if (item instanceof RecordTypes.MatchRecord) {
            item.transactions.forEach(tx => { list.push(tx) })
            return list
          }
          list.push(item)
          return list
        }, [])
    }
  },
  watch: {
    currentAsset (value) {
      this.loadList(value)
    }
  },
  created () {
    this.loadList(this.currentAsset)
  },
  methods: {
    ...mapActions({
      loadList: vuexTypes.GET_TX_LIST
    }),
    toggleDetails (index) {
      this.index = this.index === index ? -1 : index
    },
    isSelected (i) {
      return this.index === i
    },
    convertAmount (amount) {
      return PricesHelper.baseToQuote(
        amount,
        this.currentAsset,
        DEFAULT_CONVERSION_ASSET
      )
    }
  }
}
</script>

<style lang="scss" scoped>

  @import '~@scss/variables';
  @import '~@scss/mixins';

  .info-widget__list {
    padding: 0 .4 * $point .6 * $point .4 * $point;

    @include respond-to-custom(130 * $point) {
      overflow-x: auto;
    }
  }

  .info-widget__title {
    color: $col-text-page-heading;
    font-size: 1.6 * $point;
    font-weight: bold;
    margin-bottom: 1.6 * $point;

    @include respond-to(medium) { margin-top: 2.4 * $point }
  }

  .info-widget__list-header,
  .info-widget__list-body-row {
    display: flex;
    justify-content: space-between;
    padding: .8 * $point 0;
  }

  .info-widget__list-body-row--details {
    position: relative;

    &:after {
      content: '';
      position: absolute;
      top: 0;
      left: 1.6 * $point;
      right: 3.0 * $point;
      height: .1 * $point;
      background-color: $col-details-border;

      @include respond-to(medium) {
        right: 1 * $point;
      }
    }
  }

  .info-widget__list-header {
    @include respond-to(medium) {
      min-width: 67 * $point;
    }
  }

  .info-widget__list-wrapper {
    position: relative;
  }

  .info-widget__list-body-elem--failed,
  .info-widget__list-body-elem--pending,
  .info-widget__list-body-elem--success {
    &:before {
      position: absolute;
      left: -2.5 * $point;
      margin-top: 2.2 * $point;
      width: 1.6 * $point;
      height: 1.6 * $point;
      border-radius: 50%;
      color: $col-block-bg;
      font-size: 1.0 * $point;
      line-height: 1.8 * $point;

      @include respond-to(medium) {
        left: -2.5 * $point;
      }

      @include respond-to-custom(80 * $point) {
        left: -2.1 * $point;
      }

      @include respond-to(xsmall) {
        left: -1.7 * $point;
      }
    }
  }

  .info-widget__list-body-elem--failed:before {
    content: '\2715';
    background-color: $col-accent;
    padding: 0 .4 * $point;
  }

  .info-widget__list-body-elem--pending:before {
    background-color: $col-pending;
    content: '';
  }

  .info-widget__list-body-elem--success:before {
    content: '\2713';
    background-color: $col-success;
    padding: 0 .3 * $point;
  }

  .info-widget__list-body-elem {
    @include box-shadow();

    background-color: $col-list-block-background;

    @include respond-to(medium) {
      min-width: 67 * $point;
    }

    &:not(:last-child) {
      margin-bottom: .6 * $point;
    }
  }

  .info-widget__list-body-item,
  .info-widget__list-header-item {
    padding: .8 * $point 1.2 * $point;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: $col-list-text;
  }

  .info-widget__list-body-row-details {
    padding-top: 1.7 * $point;
    padding-bottom: 1.7 * $point;
    margin: 0 2 * $point;
    min-width: 40 * $point;
  }

  .info-widget__history {
    max-width: 28 * $point;

    @include respond-to(medium) {
      margin-left: auto;
      margin-right: 3 * $point;
    }
  }

  .info-widget__list-body-item--btn,
  .info-widget__list-header-item--btn {
    width: 7 * $point;
    flex: none;
    padding: 0;

    @include respond-to(medium) {
      width: 4.7 * $point;
    }
  }

  .info-widget__list-body-item-btn {
    @include button();
    @include button-flat();

    color: $col-list-btn-details-text;
    background: $col-list-btn-details-background;
    font-size: 1 * $point;
    border-radius: .4 * $point;
    padding: .8 * $point;
  }

  .info-widget__list-body-item-icon {
    color: $col-list-text !important;
    font-size: 2 * $point !important;
    font-weight: 400;
    transition: transform .15s ease-out;
    will-change: transform;
  }

  .info-widget__list-body-item-icon--active { transform: rotate(-180deg) }

  .info-widget__list-header-item--date,
  .info-widget__list-body-item--date {
    width: 20%;

    @include respond-to(medium) {
      width: 16%;
      min-width: 11.4 * $point;
  }
  }

  .info-widget__list-body-item--type,
  .info-widget__list-header-item--type {
    width: 30%;

    @include respond-to(medium) {
      width: 15%;
      min-width: 16.6 * $point;
    }
  }

  .info-widget__list-body-item--asset,
  .info-widget__list-header-item--asset {
    width: 12%;

    @include respond-to(medium) {
      display: none;
    }
  }

  .info-widget__list-body-item--amount,
  .info-widget__list-header-item--amount {
    width: 20%;

    @include respond-to(medium) {
      width: 11%;
      min-width: 10.7 * $point;
    }
  }

  .info-widget__list-body-item--counterparty,
  .info-widget__list-header-item--counterparty {
    width: 25%;

    @include respond-to(medium) {
      width: 18%;
      min-width: 11.8 * $point;
    }
  }

  .info-widget__list-body-item--status,
  .info-widget__list-header-item--status {
    width: 15%;

    @include respond-to(medium) {
      display: none;
      width: 15%;
      min-width: 9.7 * $point;
    }
  }

</style>
