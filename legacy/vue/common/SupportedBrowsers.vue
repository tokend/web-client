<template>
  <div class="supported-browsers">
    <div class="supported-browsers__wrapper">
      <logotype class="supported-browsers__logotype" />
      <h1 class="supported-browsers__title">
        {{ i18n.supbrows_title() }}
      </h1>
      <h2 class="supported-browsers__description">
        {{ i18n.supbrows_description() }}
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
            Google chrome (68+)
          </h3>
          <div class="supported-browsers__browser-link">
            <a href="https://www.google.com/chrome" target="_blank">
              {{ i18n.lbl_go_to_website() }}
              <md-icon>open_in_new</md-icon>
            </a>
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
            <a href="https://www.firefox.com/" target="_blank">
              {{ i18n.lbl_go_to_website() }}
              <md-icon>open_in_new</md-icon>
            </a>
          </div>
        </div>
        <div class="supported-browsers__browser">
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
            Safari (11+)
          </h3>
          <div class="supported-browsers__browser-link">
            <a href="https://www.apple.com/safari/" target="_blank">
              {{ i18n.lbl_go_to_website() }}
              <md-icon>open_in_new</md-icon>
            </a>
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
            <a href="https://www.opera.com/" target="_blank">
              {{ i18n.lbl_go_to_website() }}
              <md-icon>open_in_new</md-icon>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Logotype from 'L@/vue/app/common/Logotype'
import { i18n } from 'L@/js/i18n'

export default {
  name: 'supported-browsers',
  components: { Logotype },
  data () {
    return {
      defaultSrc: '../../../static/images/browsers-logotypes',
      i18n
    }
  }
}
</script>

<style lang="scss">
  @import '~L@scss/mixins';
  @import '~L@scss/variables';

  $custom-medium-breakpoint: 767px;
  $custom-small-breakpoint: 470px;
  $custom-height-large-breakpoint: 690px;
  $custom-height-medium-breakpoint: 570px;

  .supported-browsers {
    max-width: 960px;
    margin: auto;
    padding: 48px 24px 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
  }

  .supported-browsers__logotype {
    margin: 0 auto;
    width: 120px;
    display: block;
    text-align: center;
    margin-bottom: 72px;
    position: absolute;
    top: 70px;
    // we can't get a size of the logo programmatically,
    // that's why we use this magic value
    left: calc(50% - 60px);
    transform: scale(2);

    @include respond-to-custom($custom-medium-breakpoint) {
      position: relative;
      top: inherit;
      left: inherit;
      transform: none;
      margin-bottom: 48px;
      transform: scale(1.5);
      margin-top: -16px;
    }

    @include respond-to-height($custom-height-large-breakpoint) {
      position: relative;
      top: inherit;
      left: inherit;
    }

    @include respond-to-height($custom-height-medium-breakpoint) {
      margin-bottom: 24px;
    }
  }

  .supported-browsers__title {
    text-align: center;
    color: $col-heading;
    margin-bottom: 24px;
    line-height: 1.5;

    @include respond-to-custom($custom-medium-breakpoint) {
      font-size: 24px;
      margin-bottom: 16px;
    }

    @include respond-to-custom($custom-small-breakpoint) {
      margin-bottom: 8px;
    }

    @include respond-to-height($custom-height-medium-breakpoint) {
      margin-bottom: 16px;
    }
  }

  .supported-browsers__description {
    text-align: center;
    margin-bottom: 64px;
    font-size: 18px;
    line-height: 1.5;
    font-weight: 500;
    padding: 0 42px;
    color: $col-text;

    @include respond-to-custom($custom-medium-breakpoint) {
      font-size: 16px;
      margin-bottom: 40px;
      padding: 0 16px;
    }

    @include respond-to-custom($custom-small-breakpoint) {
      padding: 0;
    }
  }

  .supported-browsers__browsers {
    display: flex;
    justify-content: space-around;

    @include respond-to-custom($custom-medium-breakpoint) {
      flex-wrap: wrap;
    }
  }

  .supported-browsers__browser {
    text-align: center;

    @include respond-to-custom($custom-medium-breakpoint) {
      width: 50%;

      &:nth-child(n+3) {
        margin-top: 16px;
      }
    }

    @include respond-to-custom($custom-small-breakpoint) {
      width: 100%;

      &:nth-child(n+2) {
        margin-top: 16px;
      }
    }
  }

  .supported-browsers__browser-picture {
    width: 128px;
    height: 128px;
    overflow: hidden;
    display: inline-block;
    margin-bottom: 16px;
  }

  .supported-browsers__browser-name {
    color: $col-text;
    margin-bottom: 8px;
  }

  .supported-browsers__browser-link {
    a {
      text-decoration: underline !important;
      position: relative;
      margin-left: -12px;

      i {
        position: absolute;
        top: -2px;
        right: -22px;;
        font-size: 16px !important;
        color: $col-text !important;
        text-decoration: none !important;
      }
    }
  }

</style>
