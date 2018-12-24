<template>
  <div class="tabs-panel">
    <div class="tabs-panel__main">
      <slot />
    </div>
    <div class="tabs-panel__extra">
      <slot name="extra" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'tabs-panel'
}
</script>

<style lang="scss" scoped>
@import "@/scss/variables";
@import "@/scss/mixins";

.tabs-panel {
  display: flex;
  align-items: center;
  width: calc(100% + 2 * $content-side-paddings);
  min-height: 6.5 * $point;
  background-color: $col-tabs-panel-background;
  margin:
    0
    -1 * $content-side-paddings
    4 * $point
    -1 * $content-side-paddings;
  padding: 1.4 * $point $content-side-paddings;

  .tabs-panel__main {
    display: flex;
    font-size: 1.7 * $point;

    & :not(:first-child) {
      margin-left: 3 * $point;
    }

    .tabs-panel__main--active {
      font-weight: bold;
      color: $col-tabs-panel-tab-active;
    }
  }

  .tabs-panel__extra {
    display: flex;
    margin-left: auto;

    & :not(:first-child) {
      margin-left: 1.2 * $point;
    }
  }

  @include respond-to($sidebar-hide-bp) {
    width: calc(100vw + 2 * $content-side-paddings);
    padding: 1.4 * $point $content-side-paddings-sm;
    margin:
      0
      -1 * $content-side-paddings-sm
      4 * $point
      -1 * $content-side-paddings-sm;
    flex-direction: column;
    align-items: start;

    .tabs-panel__extra {
      margin-top: 2 * $point;
      margin-left: 0;
    }
  }
}
</style>
