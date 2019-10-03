<template>
  <div class="downloads">
    <router-link
      tag="button"
      class="downloads__link app__button"
      :to="vueRoutes.app"
    >
      {{ 'downloads-page.go-back-btn' | globalize }}
    </router-link>
    <h2 class="downloads__title">
      {{ 'downloads-page.title' | globalize }}
    </h2>

    <div class="downloads__content">
      <section
        class="downloads__section"
        v-if="config.IOS_MANIFEST_LINK || config.PLAY_MARKET_LINK"
      >
        <h3 class="downloads__section-header">
          {{ 'downloads-page.mobile-apps-header' | globalize }}
        </h3>
        <p class="downloads__section-text">
          {{ 'downloads-page.mobile-apps-desc' | globalize }}
        </p>

        <div class="downloads__phones-wrapper">
          <div class="downloads__phones">
            <div
              class="downloads__android"
              v-if="config.PLAY_MARKET_LINK"
            >
              <img
                class="downloads__phone-img"
                :src="androidCroppedImgUrl"
              >
              <a
                :href="config.PLAY_MARKET_LINK"
                target="_blank"
                rel="noopener"
              >
                <img
                  class="downloads__store-img"
                  :src="googlePlayCroppedImgUrl"
                >
              </a>
            </div>

            <div
              class="downloads__ios"
              v-if="config.IOS_MANIFEST_LINK"
            >
              <img
                class="downloads__phone-img"
                :src="iphoneImgUrl"
              >
              <a
                :href="config.IOS_MANIFEST_LINK"
                target="_blank"
                rel="noopener"
              >
                <img
                  class="downloads__store-img"
                  :src="appStoreCroppedImgUrl"
                >
              </a>
            </div>
          </div>
          <img
            class="downloads__phones-overlay"
            :src="phonesOverlayImgUrl"
          >
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import config from '@/config'

import { vueRoutes } from '@/vue-router/routes'

export default {
  name: 'downloads',
  components: {
  },
  data: _ => ({
    androidCroppedImgUrl: `${config.IMG_BUCKET_URL}/downloads-page/android_cropped.png`,
    googlePlayCroppedImgUrl: `${config.IMG_BUCKET_URL}/downloads-page/google_play_cropped.png`,
    iphoneImgUrl: `${config.IMG_BUCKET_URL}/downloads-page/iphone.png`,
    appStoreCroppedImgUrl: `${config.IMG_BUCKET_URL}/downloads-page/app_store_cropped.png`,
    phonesOverlayImgUrl: `${config.IMG_BUCKET_URL}/downloads-page/phones_overlay.png`,
    vueRoutes,
    config,
  }),
}
</script>

<style lang="scss" scoped>
  @import '~@scss/variables';
  @import '~@scss/mixins';

  .downloads {
    padding: 3.3rem 19.5rem;

    @include respond-to($x-medium) {
      padding: 3.3rem 10rem;
    }
    @include respond-to($medium) {
      padding: 3.3rem 6rem;
    }
    @include respond-to($tablet) {
      padding: 3.3rem 2rem;
    }
  }

  .downloads__link {
    padding: 0;
    font-weight: 400;
    font-size: 1.3rem;
  }

  .downloads__title {
    font-size: 4rem;
    font-weight: 400;
    color: $col-downloads-title;
  }

  .downloads__content {
    margin-top: 3.5rem;
    border-radius: 0.2rem;
    background-color: $col-downloads-block-bg;
    padding: 4.1rem 10rem;

    @include box-shadow();
    @include respond-to($medium) {
      padding: 4.1rem 6rem;
    }
    @include respond-to($tablet) {
      padding: 2rem;
    }
  }

  .downloads__section {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-top: 1.2rem;

    &:not(:first-child) {
      margin-top: 4.7rem;
    }
  }

  .downloads__section hr {
    width: 100%;
    margin-top: 4.8rem;
    border: $col-downloads-line solid 0.05rem;
  }

  .downloads__section-header {
    font-size: 2.9rem;
    font-weight: 400;
    color: $col-downloads-header;
  }

  .downloads__section-text {
    font-size: 1.4rem;
    padding-top: 0.8rem;
    color: $col-downloads-text;
  }

  .downloads__phones-wrapper {
    position: relative;
    width: 100%;
    height: 41.5rem;
    margin-top: 3.9rem;

    @include respond-to(small) {
      height: 100%;
    }
  }

  .downloads__phones-overlay {
    margin: 8.3rem auto 0;
    display: block;
    max-width: 52.7rem;

    @include respond-to(small) {
      display: none;
    }
  }

  .downloads__phones {
    display: flex;
    position: absolute;
    left: 50%;
    max-width: 35rem;
    transform: translateX(-50%);

    @include respond-to(small) {
      display: block;
      position: relative;
      left: 0;
      max-width: 100%;
      transform: none;
    }
  }

  .downloads__phone-img,
  .downloads__android,
  .downloads__ios {
    max-width: 16rem;

    @include respond-to(small) {
      max-width: 100%;
    }
  }

  .downloads__ios {
    margin-left: 2.9rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    @include respond-to(small) {
      margin-left: 0;
      margin-top: 4rem;
    }
  }

  .downloads__store-img {
    margin-top: 3.9rem;
    max-width: 16rem;

    @include respond-to(small) {
      max-width: 24rem;
      width: 100%;
    }
  }
</style>
