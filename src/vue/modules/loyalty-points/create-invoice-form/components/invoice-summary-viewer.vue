<template>
  <div class="invoice-summary-viewer">
    <h3>
      {{ 'create-invoice-form.summary-title' | globalize }}
    </h3>

    <div class="app__table invoice-summary-viewer__table">
      <table>
        <tbody>
          <tr>
            <td>{{ 'create-invoice-form.state-th' | globalize }}</td>
            <td>
              <invoice-state-viewer :invoice="invoice" />
            </td>
          </tr>

          <tr>
            <td>{{ 'create-invoice-form.subject-th' | globalize }}</td>
            <td>{{ invoice.subject }}</td>
          </tr>

          <tr>
            <td>{{ 'create-invoice-form.point-th' | globalize }}</td>
            <td>{{ invoice.asset.nameAndCode }}</td>
          </tr>

          <tr>
            <td>{{ 'create-invoice-form.total-price-th' | globalize }}</td>
            <td>{{ invoiceTotalPrice | formatMoney }}</td>
          </tr>

          <tr>
            <td>{{ 'create-invoice-form.system-th' | globalize }}</td>
            <td>
              <a
                class="invoice-summary-viewer__link"
                :href="invoice.system"
              >
                {{ invoice.system }}
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import InvoiceStateViewer from './invoice-state-viewer'

import { Invoice } from '../wrappers/invoice'

export default {
  name: 'invoice-summary-viewer',
  components: {
    InvoiceStateViewer,
  },

  props: {
    invoice: { type: Invoice, required: true },
  },

  computed: {
    invoiceTotalPrice () {
      return {
        value: this.invoice.totalPrice,
        currency: this.invoice.asset.code,
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import "~@scss/variables";

.invoice-summary-viewer__table {
  margin-top: 1rem;

  table {
    tr td:last-child {
      text-align: right;
    }
  }
}

.invoice-summary-viewer__link {
  color: $col-primary-lighten;
  text-decoration: none;

  &:visited {
    color: $col-primary-lighten;
  }
}
</style>
