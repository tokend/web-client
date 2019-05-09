<template>
  <div class="sale-statistics-viewer">
    Statistics
  </div>
</template>

<script>
import { SaleRecord } from '@/js/records/entities/sale.record'

export default {
  name: 'sale-statictics-viewer',

  props: {
    sale: { type: SaleRecord, required: true },
  },
}
</script>
