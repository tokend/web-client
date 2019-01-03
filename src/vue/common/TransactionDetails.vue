<template>
  <table class="record-viewer app__table-details">
    <tr
      class="record-viewer__row-wrp"
      v-for="(value, key) in tx.detailsView"
      :key="key"
    >
      <td class="record-viewer__td" v-if="value">
        {{ `tx-pages.${key}` | globalize }}
      </td>
      <td class="record-viewer__td" v-if="value">
        <template v-if="value.processor === 'email'">
          {{ value.processorArg.id }}
        </template>

        <template v-else-if="value.processor === 'convert'">
          <converted-amount-getter
            :amount="value.processorArg.amount"
            :asset="value.processorArg.asset" />
        </template>

        <template v-else>
          {{ tx | processor({name: value, arg: key}) }}
        </template>
      </td>
    </tr>
  </table>
</template>

<script>
import { formatMoney } from '@/vue/filters/formatMoney'
import { translate } from 'L@/vue/common/filters/translate'
import { humanizePastDate, getDateByDMY } from 'L@/js/utils/dates.util'
import cloneDeep from 'lodash/cloneDeep'
import snakeCase from 'lodash/snakeCase'

import ConvertedAmountGetter from 'c@/ConvertedAmountGetter'

export default {
  components: {
    ConvertedAmountGetter
  },
  filters: {
    processor (tx, { name, arg }) {
      // TODO: handle locale change
      let result = ''
      switch (name.processor) {
        case 'formatAmount':
          result = formatMoney(tx[arg], { currency: name.processorArg.asset })
          break

        case 'translate':
          result = translate(tx[arg])
          break

        case 'formatDate':
          result = getDateByDMY(tx[arg])
          break

        case 'formatDateTime':
          result = humanizePastDate(tx[arg])
          break

        case 'processedValue':
          result = name.processorArg.value
          break

        default:
          result = result = cloneDeep(tx[arg])
          break
      }
      return result
    }
  },
  props: {
    tx: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  methods: {
    snakeCase,
    getLabel (key) {
      return 'tx_' + snakeCase(key)
    }
  }
}
</script>

<style scoped>
  .record-viewer__td {
    border: none;
  }
</style>
