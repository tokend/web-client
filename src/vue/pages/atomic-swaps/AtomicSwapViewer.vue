<template>
  <div class="atomic-swap-viewer">
    <atomic-swap-attributes :atomic-swap="currentAtomicSwap" />
    <atomic-swap-actions :atomic-swap="currentAtomicSwap" />
  </div>
</template>

<script>
import AtomicSwapAttributes from './AtomicSwapAttributes'
import AtomicSwapActions from './AtomicSwapActions'
import { AtomicSwapRecord } from '@/js/records/entities/atomic-swap.record'

export default {
  name: 'atomic-swap-viewer',

  components: {
    AtomicSwapAttributes,
    AtomicSwapActions,
  },

  props: {
    currentAtomicSwap: {
      type: AtomicSwapRecord,
      required: true,
    },
  },
}
</script>
