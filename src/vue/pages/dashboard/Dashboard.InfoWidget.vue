<template>
  <div class="info-widget">
    <template v-if="transactions.length">
      <op-list :list="transactions" />
    </template>
    <template v-else>
      <no-data-message
        icon-name="trending_up"
        :title-id="'dashboard.no-transaction-history'"
        :message-id="'dashboard.here-will-transactions-list'"
      />
    </template>
  </div>
</template>

<script>
import OpList from '@/vue/common/OpList'
import NoDataMessage from '@/vue/common/NoDataMessage'

import { Sdk } from '@/sdk'
import config from '@/config'

import { TX_STATES } from '@/js/const/transaction-statuses.const'

import { RecordWrapper } from '@/js/records'
import { MatchRecord } from '@/js/records/operations/match.record'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

export default {
  name: 'info-widget',
  components: {
    NoDataMessage,
    OpList,
  },
  props: {
    currentAsset: { type: String, required: true },
  },
  data: () => ({
    transactionsToShow: 10,
    transactionsOrder: 'desc',
    config,
    TX_STATES,
    index: -1,
    transactions: [],
  }),
  computed: {
    ...mapGetters({
      balances: vuexTypes.accountBalances,
      accountId: vuexTypes.accountId,
    }),
  },
  watch: {
    currentAsset () {
      this.loadList()
    },
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
        order: this.transactionsOrder,
      })

      this.transactions = response.data.map(el => {
        return RecordWrapper.operation(el, {
          accountId: this.accountId,
          asset: this.currentAsset,
          balanceId: this.balances
            .find(item => item.asset === this.currentAsset)
            .balanceId,
        })
      }).reduce((list, item) => {
        if (item instanceof MatchRecord) {
          item.effects.forEach(tx => {
            list.push(Object.assign(item, tx))
          })
        } else {
          list.push(item)
        }

        return list
      }, [])
    },
    toggleDetails (index) {
      this.index = this.index === index ? -1 : index
    },
    isSelected (i) {
      return this.index === i
    },
  },
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
