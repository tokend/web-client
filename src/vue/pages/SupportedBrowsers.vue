<template>
  <div class="supported-browsers">
    <div class="supported-browsers__wrapper">
      <logo class="supported-browsers__logotype" />
      <h1 class="supported-browsers__title">
        Browsers that support all of our features
      </h1>
      <h2 class="supported-browsers__description">
        Some browsers can not support some our features. You need to update
        your current browser or download browser that supports all of our
        features by following links below.
      </h2>

      <div class="supported-browsers__browsers">
        <div class="supported-browsers__browser">
          <picture class="supported-browsers__browser-picture">
            <img
              :srcset="`
                ${defaultSrc}/chrome/chrome_128x128.png,
                ${defaultSrc}/chrome/chrome_256x256.png 2x
              `"
              :src="`${defaultSrc}/chrome/chrome_128x128.png`"
              alt="Chrome logotype"
            >
          </picture>
          <h3 class="supported-browsers__browser-name">
            Google Chrome (68+)
          </h3>
          <div class="supported-browsers__browser-link">
            <template v-if="browserType === BROWSER_TYPES.ios">
              <a href="https://itunes.apple.com/ua/app/google-chrome/id535886823?mt=8" target="_blank">
                App store
                <i class="mdi mdi-open-in-new" />
              </a>
            </template>
            <template v-else-if="browserType === BROWSER_TYPES.android">
              <a href="https://itunes.apple.com/ua/app/google-chrome/id535886823?mt=8" target="_blank">
                Google play
                <i class="mdi mdi-open-in-new" />
              </a>
            </template>
            <template v-else>
              <a href="https://www.google.com/chrome" target="_blank">
                Go to website
                <i class="mdi mdi-open-in-new" />
              </a>
            </template>
          </div>
        </div>
        <div class="supported-browsers__browser">
          <picture class="supported-browsers__browser-picture">
            <img
              :srcset="`
                ${defaultSrc}/firefox/firefox_128x128.png,
                ${defaultSrc}/firefox/firefox_256x256.png 2x
              `"
              :src="`${defaultSrc}/firefox/firefox_128x128.png`"
              alt="Firefox logotype"
            >
          </picture>
          <h3 class="supported-browsers__browser-name">
            Mozilla Firefox (61+)
          </h3>
          <div class="supported-browsers__browser-link">
            <template v-if="browserType === BROWSER_TYPES.ios">
              <a href="https://itunes.apple.com/app/id989804926?mt=8" target="_blank">
                App store
                <i class="mdi mdi-open-in-new" />
              </a>
            </template>
            <template v-else-if="browserType === BROWSER_TYPES.android">
              <a href="https://play.google.com/store/apps/details?id=org.mozilla.firefox" target="_blank">
                Google play
                <i class="mdi mdi-open-in-new" />
              </a>
            </template>
            <template v-else>
              <a href="https://www.firefox.com/" target="_blank">
                Go to website
                <i class="mdi mdi-open-in-new" />
              </a>
            </template>
          </div>
        </div>
        <div v-if="isMacOS" class="supported-browsers__browser">
          <picture class="supported-browsers__browser-picture">
            <img
              :srcset="`
                ${defaultSrc}/safari/safari_128x128.png,
                ${defaultSrc}/safari/safari_256x256.png 2x
              `"
              :src="`${defaultSrc}/safari/safari_128x128.png`"
              alt="Safari logotype"
            >
          </picture>
          <h3 class="supported-browsers__browser-name">
            Safari (10+)
          </h3>
          <div v-if="isSafari" class="supported-browsers__browser-link">
            System update required
          </div>
        </div>
        <div v-if="isWindows" class="supported-browsers__browser">
          <picture class="supported-browsers__browser-picture">
            <img
              :srcset="`
                ${defaultSrc}/edge/edge_128x128.png,
                ${defaultSrc}/edge/edge_256x256.png 2x
              `"
              :src="`${defaultSrc}/edge/edge_128x128.png`"
              alt="Edge logotype"
            >
          </picture>
          <h3 class="supported-browsers__browser-name">
            Edge (17+)
          </h3>
          <div v-if="isEdge" class="supported-browsers__browser-link">
            System update required
          </div>
        </div>
        <div class="supported-browsers__browser">
          <picture class="supported-browsers__browser-picture">
            <img
              :srcset="`
                ${defaultSrc}/opera/opera_128x128.png,
                ${defaultSrc}/opera/opera_256x256.png 2x
              `"
              :src="`${defaultSrc}/opera/opera_128x128.png`"
              alt="Opera logotype"
            >
          </picture>
          <h3 class="supported-browsers__browser-name">
            Opera (54+)
          </h3>
          <div class="supported-browsers__browser-link">
            <template v-if="browserType === BROWSER_TYPES.ios">
              <a href="https://itunes.apple.com/app/id1411869974?mt=8&pt=341230&ct=ose_google_via_opera_com_opera_touch_download_on_the_app_store" target="_blank">
                App store
                <i class="mdi mdi-open-in-new" />
              </a>
            </template>
            <template v-else-if="browserType === BROWSER_TYPES.android">
              <a href="https://play.google.com/store/apps/details?id=com.opera.touch&referrer=utm_source%3Dgoogle_via_opera_com%26utm_medium%3Dose%26utm_campaign%3Dgoogle_ose_via_opera_com%26utm_content%3D%2Fru%2Fdownload_via_opera_touch_android" target="_blank">
                Google play
                <i class="mdi mdi-open-in-new" />
              </a>
            </template>
            <template v-else>
              <a href="https://www.opera.com/" target="_blank">
                Go to website
                <i class="mdi mdi-open-in-new" />
              </a>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Logo from '@/vue/assets/Logo'

const BROWSER_TYPES = {
  desktop: 'desktop',
  ios: 'ios',
  android: 'android',
}

export default {
  name: 'supported-browsers',
  components: { Logo },
  data: () => ({
    defaultSrc: '../../../static/images/browsers-logotypes',
    browserType: BROWSER_TYPES.desktop,
    isMacOS: false,
    isSafari: false,
    isWindows: false,
    isEdge: false,
    BROWSER_TYPES,
  }),
  created () {
    this.detectBrowserType()
  },
  methods: {
    detectBrowserType () {
      const isDesktop = typeof window.orientation === 'undefined'
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
      const isAndroid = /(android)/i.test(navigator.userAgent)

      this.isMacOS = navigator.platform.indexOf('Mac') > -1
      this.isSafari = !!navigator.userAgent.match(/.*Version.*Safari.*/)
      this.isWindows = navigator.platform.indexOf('Win') > -1
      this.isEdge = !!navigator.userAgent.match(/\b(MSIE |Trident.*?rv:|Edge\/)(\d+)/)

      if (isDesktop) {
        this.browserType = BROWSER_TYPES.desktop
      } else if (isIOS) {
        this.browserType = BROWSER_TYPES.ios
      } else if (isAndroid) {
        this.browserType = BROWSER_TYPES.android
      }
    },
  },
}
</script>

<style lang="scss">
@import '~@scss/mixins';
@import '~@scss/variables';

$media-custom-medium-breakpoint: 767px;
$media-custom-small-breakpoint: 470px;
$media-custom-height-large-breakpoint: 690px;
$media-custom-height-medium-breakpoint: 570px;

.supported-browsers {
  max-width: 96rem;
  margin: auto;
  padding: 4.8rem 2.4rem 3.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.supported-browsers__logotype {
  margin: 0 auto;
  width: 12rem;
  display: block;
  text-align: center;
  margin-bottom: 7.2rem;
  position: absolute;
  top: 7rem;
  // we can't get a size of the logo programmatically,
  // that's why we use this magic value
  left: calc(50% - 6rem);
  transform: scale(2);

  @include respond-to-custom($media-custom-medium-breakpoint) {
    position: relative;
    top: inherit;
    left: inherit;
    margin-bottom: 4.8rem;
    transform: scale(1.5);
    margin-top: -1.6rem;
  }
  @include respond-to-height($media-custom-height-large-breakpoint) {
    position: relative;
    top: inherit;
    left: inherit;
  }
  @include respond-to-height($media-custom-height-medium-breakpoint) {
    margin-bottom: 2.4rem;
  }
}

.supported-browsers__title {
  text-align: center;
  color: $col-heading;
  margin-bottom: 2.4rem;
  line-height: 1.5;

  @include respond-to-custom($media-custom-medium-breakpoint) {
    font-size: 2.4rem;
    margin-bottom: 1.6rem;
  }
  @include respond-to-custom($media-custom-small-breakpoint) {
    margin-bottom: 0.8rem;
  }
  @include respond-to-height($media-custom-height-medium-breakpoint) {
    margin-bottom: 1.6rem;
  }
}

.supported-browsers__description {
  text-align: center;
  margin-bottom: 6.4rem;
  font-size: 1.8rem;
  line-height: 1.5;
  font-weight: 500;
  padding: 0 4.2rem;
  color: $col-text;

  @include respond-to-custom($media-custom-medium-breakpoint) {
    font-size: 1.6rem;
    margin-bottom: 4rem;
    padding: 0 1.6rem;
  }
  @include respond-to-custom($media-custom-small-breakpoint) {
    padding: 0;
  }
}

.supported-browsers__browsers {
  display: flex;
  justify-content: space-around;

  @include respond-to-custom($media-custom-medium-breakpoint) {
    flex-wrap: wrap;
  }
}

.supported-browsers__browser {
  text-align: center;

  @include respond-to-custom($media-custom-medium-breakpoint) {
    width: 50%;

    &:nth-child(n+3) {
      margin-top: 1.6rem;
    }
  }
  @include respond-to-custom($media-custom-small-breakpoint) {
    width: 100%;

    &:nth-child(n+2) {
      margin-top: 1.6rem;
    }
  }
}

.supported-browsers__browser-picture {
  width: 12.8rem;
  height: 12.8rem;
  overflow: hidden;
  display: inline-block;
  margin-bottom: 1.6rem;
}

.supported-browsers__browser-name {
  color: $col-text;
  margin-bottom: 0.8rem;
}

/* stylelint-disable */
.supported-browsers__browser-link {
  a {
    text-decoration: underline !important;
    position: relative;
    margin-left: -1.2rem;
    i {
      position: absolute;
      top: -0.2rem;
      right: -2.2rem;
      font-size: 1.6rem !important;
      color: $col-text !important;
      text-decoration: none !important;
    }
  }
}
/* stylelint-enable */
</style>
