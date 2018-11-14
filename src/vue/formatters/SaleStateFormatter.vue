<template>
  <span class="sale-state-formatter">
    <template v-if="sale.isUpcoming">
      <template v-if="sale.startsIn <= 1">
        {{ 'Starts' | translate }}
        {{ sale.startTime | humanDate }}
      </template>
      <template v-else>
        {{ 'Starts in' | translate }}
        {{ sale.startsIn }}
        {{ 'days' | translate }}
      </template>
    </template>

    <template v-else-if="sale.isOpened">
      <template v-if="sale.daysToGo >= 1">
        {{ 'ends' | translate }}
        {{ sale.endTime | humanDate }}
      </template>
      <template v-else>
        {{ sale.daysToGo }}
        {{ 'days left' | translate }}
      </template>
    </template>

    <template v-else-if="sale.isClosed">
      {{ 'Finished' | translate }}
    </template>

    <template v-else-if="sale.isCanceled">
      {{ 'Canceled' | translate }}
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
