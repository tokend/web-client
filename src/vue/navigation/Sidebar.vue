<template>
  <div class="sidebar">
    <div
      class="sidebar__backdrop"
      :class="{ 'sidebar__backdrop--active': isOpened }"
      @click="closeSidebar"
    />

    <button
      @click="openSidebar"
      class="sidebar__burger-btn"
      :class="{ 'sidebar__burger-btn--sidebar-active': isOpened }"
    >
      <i class="mdi mdi-menu" />
    </button>

    <div
      class="sidebar__lists"
      :class="{ 'sidebar__lists--closed': !isOpened }"
    >
      <section class="sidebar__logotype">
        <router-link
          @click.native="closeSidebar"
          :to="vueRoutes.app"
        >
          <logo class="sidebar__logotype-icon" />
        </router-link>
      </section>

      <section class="sidebar__list">
        <ul>
          <router-link
            v-ripple
            class="sidebar__list-item"
            @click.native="closeSidebar"
            :to="vueRoutes.dashboard"
            tag="li"
            v-if="config.FEATURE_FLAGS.dashboard"
          >
            <i class="sidebar__list-item-icon mdi mdi-view-dashboard" />
            <span>
              {{ 'pages-names.dashboard' | globalize }}
            </span>
          </router-link>
          <router-link
            v-ripple
            class="sidebar__list-item"
            @click.native="closeSidebar"
            :to="vueRoutes.fees"
            tag="li"
            v-if="config.FEATURE_FLAGS.fees"
          >
            <i class="sidebar__list-item-icon mdi mdi-flash" />
            <span>
              {{ 'pages-names.fees' | globalize }}
            </span>
          </router-link>
        </ul>
      </section>

      <app-footer />
    </div>
  </div>
</template>

<script>
import Logo from '@/vue/assets/Logo'
import AppFooter from '@/vue/navigation/Footer'

import { vueRoutes } from '@/vue-router/routes'

import config from '@/config'

export default {
  name: 'sidebar',

  components: {
    Logo,
    AppFooter
  },

  data: () => ({
    isOpened: false,
    config,
    vueRoutes
  }),

  methods: {
    openSidebar () {
      this.isOpened = true
    },
    closeSidebar () {
      this.isOpened = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@scss/variables";
@import "~@scss/mixins";

.sidebar {
  position: relative;
  background-color: $col-sidebar-background !important;
  box-shadow: inset -1rem -1rem 2rem 0 rgba(0, 0, 0, 0.03);
  min-height: 100%;
}

.sidebar__lists {
  width: $sidebar-width;
  min-height: 100%;
  padding-bottom: 7rem;
  z-index: 120;
  list-style: none;

  @include respond-to-custom($sidebar-hide-bp) {
    opacity: 1;
    width: $sidebar-width;
    background-color: $col-sidebar-background-media-small !important;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &.sidebar__lists--closed {
    @include respond-to-custom($sidebar-hide-bp) {
      opacity: 0;
      width: 0;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    }
  }
}

.sidebar__backdrop {
  @include respond-to-custom($sidebar-hide-bp) {
    position: fixed;
    left: -100%;
    top: 0;
    z-index: 115;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    opacity: 0;
    transition: opacity 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &.sidebar__backdrop--active {
    left: $sidebar-width;
    opacity: 1;
    transition: opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1) 0.1s;
  }
}

.sidebar__burger-btn {
  position: absolute;
  left: .5rem;
  top: 4.1rem;
  z-index: 110;
  width: 4rem;
  height: 4rem;
  margin-right: 0;
  margin-left: .8rem !important;
  border: none;
  outline: none;
  border-radius: 50%;
  background-color: $col-button-flat-txt !important;
  transform: translateX($sidebar-width);
  opacity: 0;
  cursor: pointer;
  transition: opacity 0.15s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);

  @include respond-to-custom($sidebar-hide-bp) {
    opacity: 1;
    transform: translateX(0);
  }

  &.sidebar__burger-btn--sidebar-active {
    transform: translateX($sidebar-width);
  }
}

.sidebar__list-item {
  display: flex;
  align-items: center;
  min-height: 4.8rem;
  cursor: pointer;
  color: $col-sidebar-text;

  &.router-link-active {
    background-color: $col-sidebar-active-elem-background;
    color: $col-sidebar-active-elem-text;
  }
}

.sidebar__list-title,
.sidebar__list-item,
.sidebar__logotype {
  padding: 0 2.4rem 0 4rem;
}

.sidebar__logotype {
  padding-top: 4rem;
  padding-bottom: 5rem;
}

.sidebar__logotype-icon {
  max-width: 9.5rem;
  width: 100%;
  height: 3.1rem;
  display: block;
}

.sidebar__list-item-icon {
  margin-right: 1.6rem;
  color: $col-sidebar-text;
  font-size: 2.4rem;

  .router-link-active & {
    color: $col-sidebar-active-elem-text;
  }
}

.sidebar__section--account {
  margin-top: 5rem;
}

.sidebar__list-title {
  color: $col-sidebar-active-elem-text;
  font-size: 1.6rem;
  margin-bottom: .8rem;
}
</style>
