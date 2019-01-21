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
/**
 * TopBar component represents a bar on top of the page content.
 *
 * To use it pass your content as a slot inside. Main slot
 * (aligned to the left side) should contain router links, filters, etc.
 * Extra slot (aligned to the right side) should contain action buttons.
 *
 * <top-bar>
 *   <template slot="main">
 *     <router-link />
 *     ...
 *     <filter />
 *     ...
 *   </template>
 *   <template slot="extra">
 *     <button>Some action</button>
 *     ...
 *   </template>
 * </top-bar>
 */
export default {
  name: 'top-bar',
}
</script>

<style lang="scss" scoped>
@import "~@scss/variables";
@import "~@scss/mixins";

.top-bar {
  display: flex;
  align-items: center;
  min-height: 6.5rem;
  background-color: $col-top-bar-background;
  color: $col-top-bar-text;
  margin:
    0
    -1 * $content-side-paddings
    4rem
    -1 * $content-side-paddings;
  padding: 1.4rem $content-side-paddings;

  .top-bar__main {
    display: flex;
    font-size: 1.7rem;

    a {
      color: $col-top-bar-tab;
      text-decoration: none;
    }

    .router-link-exact-active {
      font-weight: bold;
      color: $col-top-bar-tab-active;
    }

    & > :not(:first-child) {
      margin-left: 3rem;
    }
  }

  .top-bar__extra {
    display: flex;
    margin-left: auto;
    padding-left: 2rem;

    & > :not(:first-child) {
      margin-left: 1.2rem;
    }
  }

  @include respond-to($sidebar-hide-bp) {
    padding: 1.4rem $content-side-paddings-sm;
    margin:
      0
      -1 * $content-side-paddings-sm
      4rem
      -1 * $content-side-paddings-sm;
    flex-direction: column;
    align-items: start;

    .top-bar__extra {
      margin-top: 1rem;
      margin-left: -1.2rem;
      padding-left: 0;
      flex-wrap: wrap;

      & > * {
        margin-left: 1.2rem;
        margin-top: 0.7rem;
        margin-bottom: 0.7rem;
      }
    }
  }
}
</style>
