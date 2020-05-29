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

<style lang="scss">
@import '~@scss/variables';
@import '~@scss/mixins';

.top-bar {
  display: flex;
  align-items: center;
  min-height: 6.5rem;
  background-color: $col-top-bar-background;
  color: $col-top-bar-text;
  margin:
    0
    -1 * $content-padding-right
    4rem
    -1 * $content-padding-left;
  padding: 1.4rem $content-padding-right 1.4rem $content-padding-left;

  @include respond-to($sidebar-hide-bp) {
    padding: 1.4rem $content-side-paddings-sm;
    margin:
      0
      -1 * $content-side-paddings-sm
      2rem
      -1 * $content-side-paddings-sm;
    flex-direction: column;
    justify-content: center;
    align-items: start;
  }

  @media (max-width: $sidebar-hide-bp) {
    overflow-x: unset;
  }
}

.top-bar__main {
  display: flex;
}

.top-bar__main a {
  color: $col-top-bar-tab;
  text-decoration: none;
}

.top-bar__main a span {
  font-size: 1.7rem;
}

.top-bar__main .router-link-active {
  font-weight: 700;
  color: $col-top-bar-tab-active;
}

.top-bar__main > :not(:first-child) {
  margin-left: 3rem;
}

.top-bar__extra {
  display: flex;
  margin-left: auto;
  padding-left: 2rem;

  @include respond-to($sidebar-hide-bp) {
    margin-left: -1.2rem;
    padding-left: 0;
    flex-wrap: wrap;
  }
}

.top-bar__extra > :not(:first-child) {
  margin-left: 1.2rem;
}

.top-bar__extra > * {
  @include respond-to($sidebar-hide-bp) {
    margin-top: 1.4rem;
    margin-left: 1.2rem;
  }
}
</style>
