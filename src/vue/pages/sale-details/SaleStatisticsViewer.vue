<template>
  <div class="sale-statistics-viewer">
    Statistics
  </div>
</template>

<script>
import { Api } from '@/api'

import { SaleRecord } from '@/js/records/entities/sale.record'

export default {
  name: 'sale-statictics-viewer',

  props: {
    sale: { type: SaleRecord, required: true },
  },

  async created () {
    await this.loadSaleParticipants()
  },

  methods: {
    async loadSaleParticipants () {
      const endpoint = `/v3/sales/${this.sale.id}/relationships/participation`
      const { data } = await Api.getWithSignature(endpoint)
      console.log(data)
    }
  }
}
</script>
