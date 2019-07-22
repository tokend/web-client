<template>
  <div class="atomic-swap-viewer">
    <atomic-swap-attributes :atomic-swap="currentAtomicSwap" />
    <atomic-swap-actions
      v-if="isAtomicSwapOwner()"
      :atomic-swap="currentAtomicSwap"
      @cancel="$emit(EVENTS.closeDrawerAndUpdateList)"
    />
  </div>
</template>

<script>
import AtomicSwapAttributes from './AtomicSwapAttributes'
import AtomicSwapActions from './AtomicSwapActions'
import { AtomicSwapRecord } from '@/js/records/entities/atomic-swap.record'
import { vuexTypes } from '@/vuex'
import { mapGetters } from 'vuex'

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

  computed: {
    ...mapGetters({
      accountId: vuexTypes.accountId,
    }),
  },

  methods: {
    isAtomicSwapOwner () {
      return this.currentAtomicSwap.ownerId === this.accountId
    },
  },
}
</script>
