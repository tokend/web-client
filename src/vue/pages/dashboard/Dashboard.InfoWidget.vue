<template>
  <div class="info-widget">
    <template v-if="transactions.length">
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
            <template v-for="(tx, i) in transactions">
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
                    {{ tx.receiver === accountId ? '+' : '-' }}{{ tx.amount }}
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
                      <i
                        class="mdi
                              mdi-menu-down
                              info-widget__list-body-item-icon"
                        :class="{
                          'info-widget__list-body-item-icon--active':
                            isSelected(i)
                        }"
                      />
                    </button>
                  </div>
                </div>
                <div
                  class="info-widget__list-body-row
                         info-widget__list-body-row--details"
                  v-if="isSelected(i)">
                  <!-- <record-details-viewer
                    class="info-widget__list-body-row-details"
                    :tx="tx"
                  /> -->
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
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import config from '@/config'
import { TX_STATES } from '@/js/const/transaction-statuses.const'
import NoDataMessage from '@/vue/common/NoDataMessage'
import EmailGetter from '@/vue/common/EmailGetter'
import { Sdk } from '@/sdk'
import { RecordWrapper } from '@/js/records'

export default {
  name: 'info-widget',
  components: {
    NoDataMessage,
    EmailGetter
  },
  props: {
    currentAsset: { type: String, required: true }
  },
  data: () => ({
    transactionsToShow: 10,
    transactionsOrder: 'desc',
    config,
    TX_STATES,
    index: -1,
    transactions: []
  }),
  computed: {
    ...mapGetters([
      vuexTypes.accountId
    ])
  },
  watch: {
    currentAsset () {
      this.loadList()
    }
  },
  created () {
    this.loadList()
  },
  methods: {
    async loadList () {
      const response = await Sdk.horizon.payments.getPage({
        asset: this.currentAsset,
        account_id: this.accountId,
        limit: this.transactionsToShow,
        order: this.transactionsOrder
      })

      this.transactions = response.data.map(el => {
        return RecordWrapper.operation(el, { accountId: this.accountId })
      })
    },
    toggleDetails (index) {
      this.index = this.index === index ? -1 : index
    },
    isSelected (i) {
      return this.index === i
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '~@scss/variables';
  @import '~@scss/mixins';

  .info-widget__list {
    padding: 0 .4rem .6rem .4rem;

    @include respond-to-custom(1300px) {
      overflow-x: auto;
    }
  }

  .info-widget__title {
    color: $col-text-page-heading;
    font-size: 1.6rem;
    font-weight: bold;
    margin-bottom: 1.6rem;

    @include respond-to(medium) { margin-top: 2.4rem }
  }

  .info-widget__list-header,
  .info-widget__list-body-row {
    display: flex;
    justify-content: space-between;
    padding: .8rem 0;
  }

  .info-widget__list-body-row--details {
    position: relative;

    &:after {
      content: '';
      position: absolute;
      top: 0;
      left: 1.6rem;
      right: 3.0rem;
      height: .1rem;
      background-color: $col-details-border;

      @include respond-to(medium) {
        right: 1rem;
      }
    }
  }

  .info-widget__list-header {
    @include respond-to(medium) {
      min-width: 67rem;
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
      left: -2.5rem;
      margin-top: 2.2rem;
      width: 1.6rem;
      height: 1.6rem;
      border-radius: 50%;
      box-sizing: border-box;
      color: $col-block-bg;
      font-size: 1.0rem;
      line-height: 1.8rem;

      @include respond-to(medium) {
        left: -2.5rem;
      }

      @include respond-to-custom(800px) {
        left: -2.1rem;
      }

      @include respond-to(xsmall) {
        left: -1.7rem;
      }
    }
  }

  .info-widget__list-body-elem--failed:before {
    content: '\2715';
    background-color: $col-accent;
    padding: 0 .4rem;
  }

  .info-widget__list-body-elem--pending:before {
    background-color: $col-pending;
    content: '';
  }

  .info-widget__list-body-elem--success:before {
    content: '\2713';
    background-color: $col-success;
    padding: 0 .3rem;
  }

  .info-widget__list-body-elem {
    @include box-shadow();

    background-color: $col-list-block-background;

    @include respond-to(medium) {
      min-width: 67rem;
    }

    &:not(:last-child) {
      margin-bottom: .6rem;
    }
  }

  .info-widget__list-body-item,
  .info-widget__list-header-item {
    padding: .8rem 1.2rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: $col-list-text;
  }

  .info-widget__list-body-row-details {
    padding-top: 1.7rem;
    padding-bottom: 1.7rem;
    margin: 0 2rem;
    min-width: 40rem;
  }

  .info-widget__history {
    max-width: 28rem;

    @include respond-to(medium) {
      margin-left: auto;
      margin-right: 3rem;
    }
  }

  .info-widget__list-body-item--btn,
  .info-widget__list-header-item--btn {
    width: 7rem;
    flex: none;
    padding: 0;

    @include respond-to(medium) {
      width: 4.7rem;
    }
  }

  .info-widget__list-body-item-btn {
    @include button();
    @include button-flat();

    color: $col-list-btn-details-text;
    background: $col-list-btn-details-background;
    font-size: 1rem;
    border-radius: .4rem;
    padding: .8rem;
  }

  .info-widget__list-body-item-icon {
    color: $col-list-text !important;
    font-size: 2rem !important;
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
      min-width: 11.4rem;
  }
  }

  .info-widget__list-body-item--type,
  .info-widget__list-header-item--type {
    width: 30%;

    @include respond-to(medium) {
      width: 15%;
      min-width: 16.6rem;
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
      min-width: 10.7rem;
    }
  }

  .info-widget__list-body-item--counterparty,
  .info-widget__list-header-item--counterparty {
    width: 25%;

    @include respond-to(medium) {
      width: 18%;
      min-width: 11.8rem;
    }
  }

  .info-widget__list-body-item--status,
  .info-widget__list-header-item--status {
    width: 15%;

    @include respond-to(medium) {
      display: none;
      width: 15%;
      min-width: 9.7rem;
    }
  }

</style>
