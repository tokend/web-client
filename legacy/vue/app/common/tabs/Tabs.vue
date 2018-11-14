<template>
  <div class="app-tabs">
    <ul role="tablist" class="app-tabs__tabs">
      <li
        v-for="(tab, i) in tabs"
        :key="i"
        :class="{ 'is-active': tab.isActive, 'is-disabled': tab.isDisabled }"
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
          role="tab">
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
export default {
  props: {
    options: {
      type: Object,
      required: false,
      default: () => ({
        useUrlFragment: true
      })
    }
  },

  data: () => ({
    tabs: [],
    activeTabHash: ''
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

      this.$emit('changed', { tab: selectedTab })

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
    }
  }
}
</script>

<style lang="scss">
  @import '~L@scss/variables.scss';
  @import '~L@scss/mixins.scss';
  .app-tabs__tabs {
    display: flex;
    justify-content: flex-start;
  }

  .app-tabs__tab {
    min-width: 72px;
    height: 48px;
    margin: 0;
    cursor: pointer;
    border-radius: 0;
    position: relative;

    &.is-active:after {
       content: '';
       display: block;
       position: absolute;
       bottom: 0;
       left: 0;
       right: 0;
       background-color: $col-tabs-indicator;
       height: 2px;
     }

    &.is-disabled {
       cursor: default;

      .app-tabs__tab-btn {
        pointer-events: none;
        opacity: 0.5;
        cursor: default;
      }
    }
  }

  .app-tabs__tab-btn {
    padding: 0 16px;
    font-size: 1.4 * $point;
    text-transform: uppercase;
    letter-spacing: .08 * $point;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: $col-tabs-txt;

    &:hover {
       background-color: $col-tabs-hover-bg;
       text-decoration: none !important;
       color: $col-tabs-txt;
     }

    @include respond-to-custom(1100px) {
      font-size: 1.2 * $point;
    }
  }

  .app-tabs__tab--disabled .app-tabs__tab-btn:hover {
    color: $col-tabs-txt;
  }
</style>
