<template>
  <div class="app-tabs">
    <ul
      role="tablist"
      class="app-tabs__tabs">
      <li
        v-for="(tab, i) in tabs"
        :key="`app-tab-${_uid}-${i}`"
        :class="{
          'app-tabs__tab--active': tab.isActive,
          'app-tabs__tab--disabled': tab.isDisabled
        }"
        class="app-tabs__tab"
        role="presentation"
        v-show="tab.isVisible"
      >
        <a
          :aria-controls="tab.hash"
          v-ripple
          :aria-selected="tab.isActive"
          @click="selectTab(tab.hash, $event)"
          :href="tab.hash"
          class="app-tabs__tab-btn"
          role="tab"
        >
          {{ tab.header }}
        </a>
      </li>
    </ul>
    <div class="app-tabs__panels">
      <slot />
    </div>
  </div>
</template>

<script>
const EVENTS = {
  changed: 'changed',
}

export default {
  props: {
    options: {
      type: Object,
      required: false,
      default: () => ({
        useUrlFragment: true,
      }),
    },
  },

  data: () => ({
    tabs: [],
    activeTabHash: '',
  }),

  created () {
    this.tabs = this.$children
  },

  mounted () {
    window.addEventListener(
      'hashchange',
      () => this.selectTab(window.location.hash)
    )

    if (this.findTab(window.location.hash)) {
      this.selectTab(window.location.hash)
      return
    }

    if (this.tabs.length) {
      this.selectTab(this.tabs[0].hash)
    }
  },

  methods: {
    findTab (hash) {
      return this.tabs.find(tab => tab.hash === hash)
    },

    selectTab (selectedTabHash, event) {
      // See if we should store the hash in the url fragment.
      if (event && !this.options.useUrlFragment) {
        event.preventDefault()
      }

      const selectedTab = this.findTab(selectedTabHash)

      if (!selectedTab) return
      if (selectedTab.isDisabled) return

      this.tabs.forEach(tab => {
        tab.isActive = (tab.hash === selectedTab.hash)
      })

      this.$emit(EVENTS.changed, { tab: selectedTab })

      this.activeTabHash = selectedTab.hash
    },

    setTabVisible (hash, visible) {
      const tab = this.findTab(hash)

      if (!tab) return

      tab.isVisible = visible

      if (tab.isActive) {
        // If tab is active, set a different one as active.
        tab.isActive = visible

        this.tabs.every((tab, index, array) => {
          if (tab.isVisible) {
            tab.isActive = true
            return false
          }

          return true
        })
      }
    },
  },
}
</script>

<style lang="scss">
@import '~@scss/variables.scss';
@import '~@scss/mixins.scss';

$media-custom-breakpoint: 1100px;

.app-tabs__tabs {
  display: flex;
  justify-content: flex-start;
}

.app-tabs__tab {
  min-width: 7.2rem;
  height: 4rem;
  margin: 0;
  cursor: pointer;
  border-radius: 0;
  position: relative;
}

.app-tabs__tab--active:after {
  content: '';
  display: block;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: $col-tabs-indicator;
  height: 0.2rem;
}

.app-tabs__tab--disabled {
  cursor: default;
}

.app-tabs__tab-btn {
  padding: 0 1.6rem;
  font-size: 1.6rem;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: $col-tabs-txt;
  text-decoration: none;
  font-weight: 700;

  &:hover {
    background-color: $col-tabs-hover-bg;
    text-decoration: none;
    color: $col-tabs-txt;
  }

  .app-tabs__tab--disabled & {
    pointer-events: none;
    opacity: 0.5;
    cursor: default;

    &:hover {
      color: $col-tabs-txt;
    }
  }

  @include respond-to-custom($media-custom-breakpoint) {
    font-size: 1.4rem;

    @media (max-width: $status-message-reposition-bp) {
      font-size: 1.2rem;
    }
  }
}
</style>
