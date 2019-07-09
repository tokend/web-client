<template>
  <div class="atomic-swap-viewer">
    <atomic-swap-attributes :atomic-swap="currentAtomicSwap" />
    <atomic-swap-actions
      :atomic-swap="currentAtomicSwap"
      @cancel="$emit(EVENTS.closeDrawerAndUpdateList)"
    />
  </div>
</template>

<script>
import AtomicSwapAttributes from './AtomicSwapAttributes'
import AtomicSwapActions from './AtomicSwapActions'
import { AtomicSwapRecord } from '@/js/records/entities/atomic-swap.record'

const EVENTS = {
  closeDrawerAndUpdateList: 'close-drawer-and-update-list',
}

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

  data () {
    return {
      EVENTS,
    }
  },
}
</script>
