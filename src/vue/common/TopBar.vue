<template>
  <div class="top-bar">
    <div class="top-bar__main">
      <slot name="main" />
    </div>
    <div class="top-bar__extra">
      <slot name="extra" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'top-bar'
}
</script>

<style lang="scss" scoped>
@import "~@scss/variables";
@import "~@scss/mixins";

.top-bar {
  display: flex;
  align-items: center;
  min-height: 6.5 * $point;
  background-color: $col-top-bar-background;
  color: $col-top-bar-text;
  margin:
    0
    -1 * $content-side-paddings
    4 * $point
    -1 * $content-side-paddings;
  padding: 1.4 * $point $content-side-paddings;

  .top-bar__main {
    display: flex;
    font-size: 1.7 * $point;

    a {
      color: $col-top-bar-tab;
    }

    .router-link-exact-active {
      font-weight: bold;
      color: $col-top-bar-tab-active;
    }

    & > :not(:first-child) {
      margin-left: 3 * $point;
    }
  }

  .top-bar__extra {
    display: flex;
    margin-left: auto;

    & > :not(:first-child) {
      margin-left: 1.2 * $point;
    }
  }

  @include respond-to($sidebar-hide-bp) {
    padding: 1.4 * $point $content-side-paddings-sm;
    margin:
      0
      -1 * $content-side-paddings-sm
      4 * $point
      -1 * $content-side-paddings-sm;
    flex-direction: column;
    align-items: start;

    .top-bar__extra {
      margin-top: 2 * $point;
      margin-left: 0;
    }
  }
}
</style>
