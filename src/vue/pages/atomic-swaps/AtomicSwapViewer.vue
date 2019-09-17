<template>
  <div class="atomic-swap-viewer">
    <atomic-swap-attributes :atomic-swap-ask="currentAtomicSwapAsk" />
    <atomic-swap-actions
      v-if="isAtomicSwapOwner()"
      :atomic-swap-ask="currentAtomicSwapAsk"
      @cancel="$emit(EVENTS.closeDrawerAndUpdateList)"
    />
    <atomic-swap-requests :atomic-swap-ask="currentAtomicSwapAsk" />
  </div>
</template>

<script>
import AtomicSwapAttributes from './AtomicSwapAttributes'
import AtomicSwapRequests from './AtomicSwapRequests'
import AtomicSwapActions from './AtomicSwapActions'
import { AtomicSwapAskRecord } from '@/js/records/entities/atomic-swap-ask.record'
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
    AtomicSwapRequests,
  },

  props: {
    currentAtomicSwapAsk: {
      type: AtomicSwapAskRecord,
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
      return this.currentAtomicSwapAsk.ownerId === this.accountId
    },
  },
}
</script>
