<template>
  <div class="invoice-viewer">
    <p class="create-invoice-form__qr-code-description">
      {{ 'create-invoice-form.qr-code-description' | globalize }}
    </p>

    <div class="invoice-viewer__qr-code">
      <qr-code-wrapper
        :value="invoiceQrCodeValue"
        :size="250"
      />
    </div>

    <clipboard-field
      class="invoice-viewer__invoice-url"
      id="invoice-url"
      :value="invoiceUrl"
      :label="'create-invoice-form.invoice-url' | globalize"
    />

    <invoice-summary-viewer
      class="invoice-viewer__summary"
      :invoice="invoice"
    />
  </div>
</template>

<script>
import InvoiceSummaryViewer from './invoice-summary-viewer'

import ClipboardField from '@/vue/fields/ClipboardField'
import QrCodeWrapper from '@/vue/common/QrCodeWrapper'

import { mapGetters } from 'vuex'
import { types } from '../store/types'

import config from '@/config'

import { Invoice } from '../wrappers/invoice'

const QR_CODE_BASE = 'tokend://loyaltypay?url='
const INVOICE_URL_BASE = 'https://go.tokend.io/loyaltypay?url='

export default {
  name: 'invoice-viewer',
  components: {
    InvoiceSummaryViewer,
    QrCodeWrapper,
    ClipboardField,
  },

  props: {
    invoice: { type: Invoice, required: true },
  },

  computed: {
    ...mapGetters('create-invoice-form', {
      accountId: types.accountId,
    }),

    encodedBlobUrl () {
      return encodeURIComponent(
        `${config.HORIZON_SERVER}/accounts/${this.accountId}/blobs/${this.invoice.blobId}`
      )
    },

    invoiceQrCodeValue () {
      return QR_CODE_BASE + this.encodedBlobUrl
    },

    invoiceUrl () {
      return INVOICE_URL_BASE + this.encodedBlobUrl
    },
  },
}
</script>

<style lang="scss" scoped>
.invoice-viewer__qr-code-description {
  font-size: 1.6rem;
}

.invoice-viewer__qr-code {
  margin-top: 2.4rem;
  text-align: center;
}

.invoice-viewer__invoice-url {
  margin-top: 3rem;
}

.invoice-viewer__summary {
  margin-top: 4rem;
}
</style>
