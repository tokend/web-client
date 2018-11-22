<template>
  <span class="sale-state-formatter">
    <template v-if="sale.isUpcoming">
      <template v-if="sale.startsIn <= 1">
        {{ 'sale_state.starts' | translate }}
        {{ sale.startTime | humanDate }}
      </template>
      <template v-else>
        {{ 'sale_state.starts_in' | translate }}
        {{ sale.startsIn }}
        {{ 'sale_state.days' | translate }}
      </template>
    </template>

    <template v-else-if="sale.isOpened">
      <template v-if="sale.daysToGo >= 1">
        {{ 'sale_state.ends' | translate }}
        {{ sale.endTime | humanDate }}
      </template>
      <template v-else>
        {{ sale.daysToGo }}
        {{ 'sale_state.days_left' | translate }}
      </template>
    </template>

    <template v-else-if="sale.isClosed">
      {{ 'sale_state.finished' | translate }}
    </template>

    <template v-else-if="sale.isCanceled">
      {{ 'sale_state.canceled' | translate }}
    </template>
  </span>
</template>

<script>
/**
 * saleTimeFormatter formats the sale startTime/endTime to the human-friendly
 * format depending on today's date, for example, for the sale with startTime
 * equal to '2018-04-10T21:00:00Z' and endTime equal to '2018-06-20T21:00:00Z'
 * the component will render the following results 'Ends tomorrow at 21:00'
 * if today is 19 July 2018
 *
 * The component css MUST NOT be scoped as you for sure will want to give it
 * different styling in different contexts
 */
import { SaleRecord } from '@/js/records/entities/sale.record'

export default {
  name: 'sale-state-formatter',
  props: {
    sale: {
      type: SaleRecord,
      required: true
    }
  }
}
</script>
