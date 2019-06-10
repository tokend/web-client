<template>
  <div class="balances-viewer">
    <div class="balances-viewer__card balances-viewer__card--balance">
      <p class="balances-viewer__card-title">
        {{ 'create-invoice-form.customer-points-title' | globalize }}
      </p>

      <p class="balances-viewer__card-amount">
        <template v-if="customerBalance">
          {{ customerBalance | formatMoney }}
        </template>

        <template v-else>
          –
        </template>
      </p>

      <p class="balances-viewer__card-description">
        {{ invoice.asset.name }}
      </p>

      <p
        v-if="customerBalanceDelta"
        class="balances-viewer__card-delta"
        :class="customerBalanceDelta > 0
          ? 'balances-viewer__card-delta--incoming'
          : 'balances-viewer__card-delta--outgoing'"
      >
        {{
          {
            value: customerBalanceDelta,
            currency: invoice.asset.code
          } | formatMoney | formatDelta
        }}
      </p>
    </div>

    <div class="balances-viewer__card balances-viewer__card--transaction">
      <p class="balances-viewer__card-title">
        {{ 'create-invoice-form.transaction-value-title' | globalize }}
      </p>

      <p class="balances-viewer__card-amount">
        {{ invoice.totalPrice | formatMoney }}
      </p>

      <p class="balances-viewer__card-description">
        {{ DEFAULT_POINT_NAME }}
      </p>
    </div>

    <div class="balances-viewer__card balances-viewer__card--point">
      <p class="balances-viewer__card-title">
        {{ DEFAULT_POINT_NAME }}
      </p>

      <p class="balances-viewer__card-amount">
        {{ invoice.amount | formatMoney }}
      </p>

      <p class="balances-viewer__card-description">
        {{
          'create-invoice-form.pair-price-hint' | globalize({
            base: DEFAULT_POINT_CODE,
            quote: invoice.asset.code,
            price: invoice.price
          })
        }}
      </p>
    </div>

    <div class="balances-viewer__card balances-viewer__card--point">
      <p class="balances-viewer__card-title">
        {{ invoice.asset.name }}
      </p>

      <p class="balances-viewer__card-amount">
        -{{ invoice.totalPrice | formatMoney }}
      </p>

      <p class="balances-viewer__card-description">
        {{
          'create-invoice-form.pair-price-hint' | globalize({
            base: invoice.asset.code,
            quote: DEFAULT_POINT_CODE,
            price: quotePrice
          })
        }}
      </p>
    </div>

    <div class="balances-viewer__card balances-viewer__card--balance">
      <p class="balances-viewer__card-title">
        {{ 'create-invoice-form.merchant-points-title' | globalize }}
      </p>

      <p class="balances-viewer__card-amount">
        <template v-if="merchantBalance">
          {{ merchantBalance | formatMoney }}
        </template>

        <template v-else>
          –
        </template>
      </p>

      <p class="balances-viewer__card-description">
        {{ DEFAULT_POINT_NAME }}
      </p>

      <p
        v-if="merchantBalanceDelta"
        class="balances-viewer__card-delta"
        :class="merchantBalanceDelta > 0
          ? 'balances-viewer__card-delta--incoming'
          : 'balances-viewer__card-delta--outgoing'"
      >
        {{
          {
            value: merchantBalanceDelta,
            currency: DEFAULT_POINT_CODE
          } | formatMoney | formatDelta
        }}
      </p>
    </div>
  </div>
</template>

<script>
import { Invoice } from '../wrappers/invoice'
import { config } from '../_config'
import { MathUtil } from '@/js/utils'

const DELTA_ANIMATION_DURATION = 1000

export default {
  name: 'balances-viewer',

  filters: {
    formatDelta (value) {
      return value.startsWith('-') ? value : `+${value}`
    },
  },

  props: {
    invoice: { type: Invoice, required: true },
    customerBalance: { type: [Number, String], default: '' },
    merchantBalance: { type: [Number, String], default: '' },
  },

  data: _ => ({
    customerBalanceDelta: '',
    merchantBalanceDelta: '',
    DEFAULT_POINT_CODE: config.DEFAULT_POINT_CODE,
    DEFAULT_POINT_NAME: config.DEFAULT_POINT_NAME,
  }),

  computed: {
    quotePrice () {
      return MathUtil.divide(1, this.invoice.price)
    },
  },

  watch: {
    'customerBalance': function (value, oldValue) {
      if (oldValue) {
        this.customerBalanceDelta = MathUtil.subtract(value, oldValue)

        setTimeout(() => {
          this.customerBalanceDelta = ''
        }, DELTA_ANIMATION_DURATION)
      }
    },

    'merchantBalance': function (value, oldValue) {
      if (oldValue) {
        this.merchantBalanceDelta = MathUtil.subtract(value, oldValue)

        setTimeout(() => {
          this.merchantBalanceDelta = ''
        }, DELTA_ANIMATION_DURATION)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';
@import '~@scss/mixins';

$col-thin-green: rgb(205, 245, 195);
$col-dark-green: green;
$col-thin-yellow: rgb(255, 249, 213);
$col-dark-yellow: rgb(228, 191, 27);
$col-blue: rgb(35, 112, 255);
$col-card-title: rgba($col-text, 0.8);

.balances-viewer {
  display: flex;
  flex-wrap: wrap;
  margin: -1rem;
}

.balances-viewer__card {
  position: relative;
  flex: 0 1 calc(20% - 2rem);
  border-radius: 0.4rem;
  background-color: $col-block-bg;
  margin: 1rem;
  text-decoration: none;
  color: inherit;
  min-width: 0;
  padding: 1rem;
  border: solid 0.3rem $col-text;
  height: 15rem;

  &--balance {
    background-color: $col-thin-green;
    border-color: $col-dark-green;
  }

  &--transaction {
    background-color: $col-thin-yellow;
    border-color: $col-dark-yellow;
  }

  &--point {
    border-color: $col-blue;
  }

  @include box-shadow();
  @include respond-to($x-medium) {
    flex: 0 1 calc(33.3% - 2rem);
  }
  @include respond-to($tablet) {
    flex: 0 1 calc(50% - 2rem);
  }
  @include respond-to($x-small) {
    flex: 0 1 calc(100% - 2rem);
  }
}

.balances-viewer__card-title {
  text-align: center;
  font-size: 2.4rem;
  color: $col-card-title;
}

.balances-viewer__card-amount {
  text-align: center;
  font-size: 3.2rem;
  margin-top: 1rem;
}

.balances-viewer__card-description {
  text-align: center;
  font-size: 1.6rem;
  margin-top: 0.6rem;
}

.balances-viewer__card-delta {
  background-color: $col-block-bg;
  text-align: center;
  padding: 0.8rem;
  border-radius: 1rem;
  position: absolute;
  top: 6rem;
  left: 50%;
  transform: translateX(-50%);
  font-size: 2rem;
  animation: move-up 1s ease-out;

  &--incoming { color: $col-success; }
  &--outgoing { color: $col-danger; }
}

@keyframes move-up {
  from { top: 6rem; }
  to { top: -4rem; }
}
</style>
