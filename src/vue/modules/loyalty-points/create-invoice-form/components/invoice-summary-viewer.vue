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
            <td>{{ 'create-invoice-form.amount-th' | globalize }}</td>
            <td>{{ invoiceAmount | formatMoney }}</td>
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
    invoiceAmount () {
      return {
        value: this.invoice.amount,
        currency: this.invoice.asset,
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.invoice-summary-viewer__table {
  margin-top: 1rem;

  table {
    tr td:last-child {
      text-align: right;
    }
  }
}
</style>
