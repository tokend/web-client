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

    <aside
      class="sidebar__aside"
      :class="{ 'sidebar__aside--closed': !isOpened }"
    >
      <section class="sidebar__logo-section">
        <router-link
          @click.native="closeSidebar"
          :to="vueRoutes.app"
        >
          <logo class="sidebar__logo" />
        </router-link>
      </section>

      <section class="sidebar__links-section">
        <nav
          v-for="[sectionName, menuItems] of Object.entries(sectionsToRender)"
          :key="sectionName"
          class="sidebar__links-group"
        >
          <p
            v-if="sectionName !== DEFAULT_SECTION_NAME"
            class="sidebar__links-group-title"
          >
            {{ sectionName | globalize }}
          </p>

          <router-link
            v-for="item in menuItems"
            :key="item.menuButtonTranslationId"
            v-ripple
            class="sidebar__link"
            @click.native="closeSidebar"
            :to="item.routerEntry.path"
            tag="a"
          >
            <i
              class="sidebar__link-icon"
              :class="`mdi mdi-${item.menuButtonMdiName}`"
            />
            <span>
              {{ item.menuButtonTranslationId | globalize }}
            </span>
          </router-link>
        </nav>
      </section>

      <section class="sidebar__footer-section">
        <app-footer />
      </section>
    </aside>
  </div>
</template>

<script>
import Logo from '@/vue/assets/Logo'
import AppFooter from '@/vue/navigation/Footer'

import { vueRoutes } from '@/vue-router/routes'

import { vuexTypes } from '@/vuex'
import { mapGetters } from 'vuex'

import config from '@/config'
import { SchemeRegistry } from '@/modules-arch/scheme-registry'

const DEFAULT_SECTION_NAME = 'default'

export default {
  name: 'sidebar',

  components: {
    Logo,
    AppFooter,
  },

  data: () => ({
    isOpened: false,
    config,
    vueRoutes,
    DEFAULT_SECTION_NAME,
  }),

  computed: {
    ...mapGetters({
      isAccountCorporate: vuexTypes.isAccountCorporate,
    }),
    sectionsToRender () {
      const sections = this.groupPagesBySections(SchemeRegistry.current.pages)
      const filteredSections = this.filterUnrenderedSections(sections)
      return filteredSections
    },
  },

  methods: {
    openSidebar () {
      this.isOpened = true
    },

    closeSidebar () {
      this.isOpened = false
    },

    groupPagesBySections (pages) {
      const result = { [DEFAULT_SECTION_NAME]: [] }

      for (const item of pages) {
        const translationId = item.menuSectionTranslationId
        if (!translationId) {
          result[DEFAULT_SECTION_NAME].push(item)
        } else {
          if (!result[translationId]) {
            result[translationId] = []
          }
          result[translationId].push(item)
        }
      }

      return result
    },

    filterUnrenderedSections (sections) {
      const result = { ...sections }

      for (const [key, value] of Object.entries(result)) {
        const filteredValue = value
          .filter(item => item.menuButtonTranslationId)
          .filter(item => item.isAccessible)

        if (filteredValue.length) {
          result[key] = filteredValue
        } else {
          delete result[key]
        }
      }

      return result
    },
  },
}
</script>

<style lang="scss" scoped>
@import "~@scss/variables";
@import "~@scss/mixins";

// we cannot wrap all the the contents into a wrapper because the links should
// take the full width of the aside when recolored
$content-item-left-padding: 4rem;
$content-item-right-padding: 2.4rem;

.sidebar {
  position: relative;
  background-color: $col-sidebar-background;
  box-shadow: inset -1rem -1rem 2rem 0 rgba(0, 0, 0, 0.03);
  min-height: 100%;
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
  left: 0.5rem;
  top: 4.1rem;
  z-index: $z-sidebar-burger;
  width: 4rem;
  height: 4rem;
  margin-right: 0;
  margin-left: 0.8rem;
  border: none;
  outline: none;
  border-radius: 50%;
  background-color: $col-button-flat-txt;
  transform: translateX($sidebar-width);
  opacity: 0;
  cursor: pointer;
  color: $col-sidebar-burger-icon-color;
  transition: opacity 0.15s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);

  @include respond-to-custom($sidebar-hide-bp) {
    opacity: 1;
    transform: translateX(0);
  }

  i {
    display: flex;
    justify-content: center;
    font-size: 2.4rem;
  }

  &.sidebar__burger-btn--sidebar-active {
    transform: translateX($sidebar-width);
  }
}

.sidebar__aside {
  width: $sidebar-width;
  min-height: 100%;
  z-index: $z-sidebar;
  list-style: none;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  visibility: visible;

  @include respond-to-custom($sidebar-hide-bp) {
    opacity: 1;
    background-color: $col-sidebar-background-media-small;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &.sidebar__aside--closed {
    @include respond-to-custom($sidebar-hide-bp) {
      opacity: 0;
      width: 0;
      visibility: hidden;
    }
  }
}

.sidebar__logo-section {
  padding-top: 4rem;
  padding-bottom: 5rem;
  padding: 4rem 2.4rem 5rem 4rem;
  padding: 4rem $content-item-right-padding 5rem $content-item-left-padding;

  @include respond-to-custom($sidebar-hide-bp) {
    .sidebar__aside--closed & {
      display: none;
    }
  }
}

.sidebar__logo {
  max-width: 9.5rem;
  width: 100%;
  height: 3.1rem;
  display: block;
}

.sidebar__links-section {
  flex: 1;

  @include respond-to-custom($sidebar-hide-bp) {
    .sidebar__aside--closed & {
      display: none;
    }
  }
}

.sidebar__links-group {
  margin-bottom: 4rem;
  &:last-child {
    margin-bottom: 0;
  }
}

.sidebar__links-group-title {
  padding: 0 $content-item-right-padding 0 $content-item-left-padding;
  opacity: 0.7;
  font-size: 1.4rem;
  margin-bottom: 0.2rem;
}

.sidebar__link {
  display: flex;
  align-items: center;
  min-height: 4.8rem;
  padding: 0 $content-item-right-padding 0 $content-item-left-padding;
  cursor: pointer;
  color: $col-sidebar-text;
  text-decoration: none;

  &.router-link-active {
    background-color: $col-sidebar-active-elem-background;
    color: $col-sidebar-active-elem-text;
    pointer-events: none;
  }
}

.sidebar__link-icon {
  margin-right: 1.6rem;
  color: $col-sidebar-text;
  font-size: 2.4rem;

  .router-link-active & {
    color: $col-sidebar-active-elem-text;
  }
}

.sidebar__footer-section {
  padding-top: 2rem;

  @include respond-to-custom($sidebar-hide-bp) {
    .sidebar__aside--closed & {
      display: none;
    }
  }
}
</style>
