<template>
  <div class="progress-bar__wrp">
    <div class="progress-bar__progress" :style="`width:${percentsCompleted}%`">
      <!---->
    </div>
  </div>
</template>

<script>
export default {
  name: 'progress-bar',
  props: {
    totalSteps: {
      type: Number,
      required: true,
    },
    completedSteps: {
      type: Number,
      required: true,
    },
  },
  computed: {
    percentsCompleted () {
      return (this.completedSteps / this.totalSteps) * 100
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables.scss';

.progress-bar__wrp {
  width: 100%;
  height: 0.3rem;
  background-color: $col-document-upload-progress-bar-bg;
  position: relative;
}

.progress-bar__progress {
  background: $col-document-upload-progress-bar-value;
  height: 100%;
}
</style>
