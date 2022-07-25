<script lang="ts" setup>
import { AppLogo } from '@/common'
</script>

<template>
  <div class="app-navbar">
    <app-logo class="app-navbar__logo" />
  </div>
</template>

<style lang="scss" scoped>
.app-navbar {
  display: flex;
  align-items: center;
  padding: toRem(24) var(--app-padding-right) toRem(24) var(--app-padding-left);
  background: var(--app-bg);
  border-bottom: var(--border-primary-main);

  @include respond-to(tablet) {
    flex-wrap: wrap;
  }
}

.app-navbar__logo {
  @include respond-to(xsmall) {
    width: 100%;
    margin-bottom: toRem(24);
  }
}

.app-navbar__links-section {
  display: flex;
  align-items: center;
  margin: 0 auto;

  @include respond-to(tablet) {
    width: 100%;
    order: 3;
  }

  @include respond-to(xsmall) {
    flex-direction: column;
    align-items: flex-start;
    width: 50%;
    order: 1;
  }
}

.app-navbar__link {
  transition: 0.35s ease-in-out;

  &:not(:last-child) {
    margin-right: toRem(64);

    @include respond-to(xsmall) {
      margin-right: 0;
      padding: toRem(6) 0;
    }
  }

  &.router-link-active {
    color: var(--primary-dark);
  }
}
</style>
