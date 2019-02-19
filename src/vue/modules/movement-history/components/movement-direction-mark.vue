<template>
  <i :class="classObj" />
</template>

<script>
import { Movement } from '../wrappers/movement'

export default {
  name: 'movement-direction-mark',
  props: {
    movement: {
      type: Movement,
      required: true,
    },
  },
  computed: {
    classObj () {
      const movement = this.movement

      return {
        'mdi': true,
        'mdi-arrow-up-bold': movement.isOutgoing || movement.isLocked,
        'mdi-arrow-down-bold': movement.isIncoming || movement.isUnlocked,
        'movement-direction-mark': true,
        'movement-direction-mark--in': movement.isIncoming,
        'movement-direction-mark--out': movement.isOutgoing,
        'movement-direction-mark--locked': movement.isLocked,
        'movement-direction-mark--unlocked': movement.isUnlocked,
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';

.movement-direction-mark {
  font-size: 1.8rem;

  &--in { color: $col-incoming }
  &--out { color: $col-outgoing }
  &--locked { color: $col-locked }
  &--unlocked { color: $col-unlocked }
}
</style>
