<template>
  <button
    class="back-button"
    @click="back">
    <md-icon class="back-button__icon">
      arrow_back
    </md-icon>
  </button>
</template>

<script>
export default {
  methods: {
    back () {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped lang="scss">
@import "~L@scss/variables";

.back-button {
  width: 3.2 * $point;
  height: 3.2 * $point;
  border: none;
  background: none;
  cursor: pointer;
}

.back-button__icon {
  width: 3.2 * $point;
  height: 3.2 * $point;
  color: $col-button-back-icon !important;
  transition: color ease-in-out 0.2s;
}

.back-button:hover > .back-button__icon {
  color: $col-button-back-icon-hover !important;
}
</style>
