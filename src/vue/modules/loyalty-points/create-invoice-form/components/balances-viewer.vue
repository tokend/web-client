<template>
  <div class="balances-viewer">
    <div class="balances-viewer__card balances-viewer__card--balance">
      <p class="balances-viewer__card-title">
        Customer's points
      </p>

      <p class="balances-viewer__card-amount">
        {{ customerBalance | formatMoney }}
      </p>

      <p class="balances-viewer__card-description">
        {{ invoice.asset.name }}
      </p>
    </div>

    <div class="balances-viewer__card balances-viewer__card--transaction">
      <p class="balances-viewer__card-title">
        Transaction value
      </p>

      <p class="balances-viewer__card-amount">
        {{ invoice.totalPrice | formatMoney }}
      </p>

      <p class="balances-viewer__card-description">
        {{ config.DEFAULT_POINT_NAME }}
      </p>
    </div>

    <div class="balances-viewer__card balances-viewer__card--point">
      <p class="balances-viewer__card-title">
        {{ config.DEFAULT_POINT_NAME }}
      </p>

      <p class="balances-viewer__card-amount">
        {{ invoice.amount | formatMoney }}
      </p>

      <p class="balances-viewer__card-description">
        1 {{ config.DEFAULT_POINT_CODE }} =
        {{ invoice.price | formatMoney }} {{ invoice.asset.code }}
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
        1 {{ invoice.asset.code }} =
        {{ 1 / invoice.price | formatMoney }} {{ config.DEFAULT_POINT_CODE }}
      </p>
    </div>

    <div class="balances-viewer__card balances-viewer__card--balance">
      <p class="balances-viewer__card-title">
        Merchant's points
      </p>

      <p class="balances-viewer__card-amount">
        {{ merchantBalance | formatMoney }}
      </p>

      <p class="balances-viewer__card-description">
        {{ config.DEFAULT_POINT_NAME }}
      </p>
    </div>
  </div>
</template>

<script>
import { Invoice } from '../wrappers/invoice'
import { config } from '../_config'

export default {
  name: 'balances-viewer',

  props: {
    invoice: { type: Invoice, required: true },
    customerBalance: { type: [Number, String], required: true },
    merchantBalance: { type: [Number, String], required: true },
  },

  data: _ => ({
    config,
  }),
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';
@import '~@scss/mixins';

.balances-viewer {
  display: flex;
  flex-wrap: wrap;
  margin: -1rem;
}

.balances-viewer__card {
  flex: 0 1 calc(20% - 2rem);
  border-radius: 0.4rem;
  // stylelint-disable-next-line
  background-color: white;
  margin: 1rem;
  text-decoration: none;
  color: inherit;
  min-width: 0;
  padding: 1rem;
  border: solid 0.3rem $col-text;
  height: 15rem;

  &--balance {
    // stylelint-disable-next-line
    background-color: rgb(205, 245, 195);
    // stylelint-disable-next-line
    border-color: green;
  }

  &--transaction {
    // stylelint-disable-next-line
    background-color: rgb(255, 249, 213);
    // stylelint-disable-next-line
    border-color: rgb(228, 191, 27);
  }

  &--point {
    // stylelint-disable-next-line
    background-color: white;
    // stylelint-disable-next-line
    border-color: rgb(35, 112, 255);
  }

  @include box-shadow();
  @include respond-to($x-medium) {
    flex: 0 1 calc(33.3% - 2rem);
  }
  @include respond-to($x-small) {
    flex: 0 1 calc(50% - 2rem);
  }
}

.balances-viewer__card-title {
  text-align: center;
  font-size: 2.4rem;
  // stylelint-disable-next-line
  color: rgba($col-text, 0.8);
}

.balances-viewer__card-amount {
  text-align: center;
  font-size: 3.2rem;
  margin-top: 1rem;
}

.balances-viewer__card-description {
  text-align: center;
  font-size: 1.6rem;
  font-weight: 700;
  margin-top: 0.6rem;
}
</style>
