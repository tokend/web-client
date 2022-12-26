<template>
  <tbody>
    <tr class="attributes-viewer__table-row">
      <td class="attributes-viewer__table-cell">
        {{ 'movements-history.type-lbl' | globalize }}
      </td>
      <td class="attributes-viewer__table-cell">
        {{ movement.effect | effectTypeTranslationId | globalize }}
      </td>
    </tr>
    <tr class="attributes-viewer__table-row">
      <td class="attributes-viewer__table-cell">
        {{ 'movements-history.operation-lbl' | globalize }}
      </td>
      <td class="attributes-viewer__table-cell">
        {{ movement.operationDetails | operationTypeTranslationId | globalize }}
      </td>
    </tr>
    <tr class="attributes-viewer__table-row">
      <td class="attributes-viewer__table-cell">
        {{ 'movements-history.date-lbl' | globalize }}
      </td>
      <td class="attributes-viewer__table-cell">
        {{ formatCalendar(movement.appliedAt) }}
      </td>
    </tr>
  </tbody>
</template>

<script>
import { Movement } from '../wrappers/movement'
import { formatCalendar } from '@/js/helpers/date-helpers'

import TranslationFiltersMixin from '../mixins/translation-filters.mixin'

export default {
  name: 'movement-summary-viewer',
  mixins: [TranslationFiltersMixin],
  props: {
    movement: {
      type: Movement,
      required: true,
    },
  },
  setup () {
    return {
      formatCalendar,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '../scss/attributes-viewer';
</style>
