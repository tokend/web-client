<template>
  <div class="sale-campaign-viewer">
    <div class="sale-campaign-viewer__logo-desc-wrp">
      <sale-logo-viewer
        class="sale-campaign-viewer__logo"
        url="/static/images/linde.jpg" />
      <div class="sale-campaign-viewer__desc">
        <span>Investment Details and Terms:</span>

        <div class="app__table app__table--last-td-to-right">
          <table>
            <tbody>
              <tr>
                <td>
                  Token name:
                </td>
                <td>
                  Linde Coin No. 1
                </td>
              </tr>
              <tr>
                <td>
                  Tokens hard cap size:
                </td>
                <td>
                  € 30 million
                </td>
              </tr>
              <tr>
                <td>
                  Price per token:
                </td>
                <td>
                  1 €
                </td>
              </tr>
              <tr>
                <td>
                  Vehicle:
                </td>
                <!-- eslint-disable-next-line max-len -->
                <td title="Tokenized Loan secured by real estate and corporate guarantee">
                  Tokenized Loan secured by real estate and corporate guarantee
                </td>
              </tr>
              <tr>
                <td>
                  Coupon rate:
                </td>
                <td>
                  6% p.a.
                </td>
              </tr>
              <tr>
                <td>
                  Maturity:
                </td>
                <td>
                  3 years
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  Fixed return asset-referenced token
                </td>
              </tr>
            </tbody>
          </table>

          <button
            class="app__button app__button-raised sale-campaign-viewer__buy-btn"
            @click="clearFields(); isBuyDrawerShown = true"
          >
            Buy
          </button>
        </div>
      </div>
    </div>
    <div class="sale-campaign-viewer__content">
      <div class="sale-campaign-viewer__state">
        <span>Description on issuer:  </span>
        <!-- eslint-disable-next-line max-len -->
        <p>Linde is a leading global industrial gases and engineering company with <b>2019</b> sales of <b>€25</b> billion, and is actively looking for expansion of its industry-leading plants  for the supply of nitrogen, oxygen and compressed air to clients to meet the increasing demand in industrial gases. Linde constructs the plants and hands them over completed to clients.</p>
      </div>

      <div class="sale-campaign-viewer__state">
        <span>Description of Investment:</span>
        <!-- eslint-disable-next-line max-len -->
        <p>Linde air separation unit to be constructed for Salgin Chemical Company (SCC) in Saratov, Russia, which is expected to be completed in <b>24</b> months, with a lead time of <b>6</b> months for contracts, by July of <b>2023</b>. Supporting Salgin Chemical’s expansion, the plant will provide nitrogen, oxygen and compressed air to meet the increasing demand for industrial gases in the region.</p>
      </div>
    </div>
    <!-- eslint-disable-next-line max-len -->
    <div class="sale-campaign-viewer__logo-desc-wrp sale-campaign-viewer__logo-desc-wrp-top">
      <div class="sale-campaign-viewer__desc">
        <span>Details of Investment:</span>
        <div class="app__table app__table--last-td-to-right">
          <table>
            <tbody>
              <tr>
                <td>
                  Location:
                </td>
                <td>
                  Saratov, Russia
                </td>
              </tr>
              <tr>
                <td>
                  Size:
                </td>
                <td>
                  40,000 sqm
                </td>
              </tr>
              <tr>
                <td>
                  Total development cost:
                </td>
                <td>
                  € 30 million
                </td>
              </tr>
              <tr>
                <td>
                  Loan amount:
                </td>
                <td>
                  € 30 million
                </td>
              </tr>
              <tr>
                <td>
                  Value upon completion:
                </td>
                <td>
                  € 45 million
                </td>
              </tr>
              <tr>
                <td>
                  Development period:
                </td>
                <td>
                  2.5 years
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <sale-logo-viewer
        class="sale-campaign-viewer__logo sale-campaign-viewer__logo-right"
        url="/static/images/saratov.jpg" />
    </div>

    <drawer :is-shown.sync="isBuyDrawerShown">
      <template slot="heading">
        Buy Linde Coin No. 1
      </template>
      <form
        class="app__form"
        @submit.prevent="submit"
      >
        <input-field
          novalidate
          white-autofill
          type="number"
          :step="$config.MIN_AMOUNT"
          v-model="form.amount"
          @blur="touchField('form.amount')"
          name="create-asset-max-issuance-amount"
          :label="'asset-form.max-issuance-amount-lbl' | globalize"
          :error-message="getFieldErrorMessage('form.amount', {
            from: 5000,
            to: $config.MAX_AMOUNT,
          })"
          :disabled="formMixin.isDisabled"
        />

        <loader
          v-if="formMixin.isDisabled"
          class="advanced-step__loader" />

        <button
          v-else
          type="submit"
          class="app__button-raised advanced-step__btn"
          :disabled="formMixin.isDisabled"
        >
          Buy
        </button>
      </form>
    </drawer>
  </div>
</template>

<script>
import Drawer from '@/vue/common/Drawer'

import SaleLogoViewer from './SaleLogoViewer'

import { SaleRecord } from '@/js/records/entities/sale.record'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import FormMixin from '@/vue/mixins/form.mixin'
import config from '@/config'
import { amountRange, required } from '@validators'
import { Bus } from '@/js/helpers/event-bus'
import Loader from '@/vue/common/Loader'

const EVENTS = {
  saleUpdated: 'sale-updated',
}

export default {
  name: 'sale-campaign-viewer',
  components: {
    Drawer,
    SaleLogoViewer,
    Loader,
  },

  mixins: [FormMixin],

  props: {
    sale: { type: SaleRecord, required: true },
  },

  data: _ => ({
    isBuyDrawerShown: false,
    isStatisticsDrawerShown: false,
    isWhitelistDrawerShown: false,
    EVENTS,
    form: {
      amount: '',
    },
  }),

  computed: {
    ...mapGetters({
      accountId: vuexTypes.accountId,
    }),
  },

  validations () {
    return {
      form: {
        amount: {
          amountRange: amountRange(5000, config.MAX_AMOUNT),
          required,
        },
      },
    }
  },

  methods: {
    submit () {
      if (!this.isFormValid()) return
      this.disableForm()

      setTimeout(() => {
        this.enableForm()
        this.isBuyDrawerShown = false
        Bus.success(`You have successfully bought ${this.form.amount} Linde Coins No. 1`)
        this.clearFields()
      }, 1000)
    },
  },
}
</script>

<style lang="scss">
@import '~@scss/variables';
@import '~@scss/mixins';

.sale-campaign-viewer {
  margin-top: 2rem;
}

.sale-campaign-viewer__actions-wrp {
  display: flex;
  margin: -1rem -1rem 1.4rem;
}

.sale-campaign-viewer__action-btn {
  margin: 1rem;
}

.sale-campaign-viewer__content {
  display: flex;
  align-items: flex-start;
  margin: -1.6rem;
  flex-wrap: wrap;

  p,
  table {
    margin-top: 1rem;
  }

  @include respond-to($small) {
    flex-direction: column-reverse;
    align-items: stretch;
  }
}

.sale-campaign-viewer__description {
  background-color: $col-sale-details-block;
  border-radius: 0.4rem;
  margin: 1.6rem;
  overflow: auto;

  span {
    color: $col-text-secondary;
  }
}

.sale-campaign-viewer__state {
  background-color: $col-sale-details-block;
  border-radius: 0.4rem;
  margin: 1.6rem;
  padding: 3.3rem 3.4rem 2.2rem 2.4rem;
  flex: 1;

  span {
    color: $col-text-secondary;
  }

  p {
    color: $col-text-black;
  }
}

.sale-campaign-viewer__logo {
  background-color: $col-sale-details-block;
  border-radius: 0.4rem;
  padding: 3.3rem 3.4rem 2.2rem 2.4rem;
  margin-right: 2rem;
  flex-basis: 60%;

  &-right {
    margin-right: 0;
    margin-left: 2rem;
  }
}

.sale-campaign-viewer__logo-desc-wrp {
  display: flex;
  margin-bottom: 2rem;

  &-top {
    margin-bottom: 0;
    margin-top: 2rem;
  }
}

.sale-campaign-viewer__desc {
  background-color: $col-sale-details-block;
  border-radius: 0.4rem;
  padding: 3.3rem 3.4rem 2.2rem 2.4rem;
  flex-basis: 40%;

  span {
    color: $col-text-secondary;
  }

  p,
  table {
    margin-top: 1rem;
  }
}

.sale-campaign-viewer__buy-btn {
  width: 100%;
  margin-top: 2rem;
}

.advanced-step__btn {
  margin: 2rem auto 0;
  width: 50%;
}

.advanced-step__loader {
  margin: 2rem auto 0;
  justify-content: center;
}
</style>
