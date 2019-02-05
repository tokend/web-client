<template>
  <div class="downloads">
    <button
      class="downloads__link"
      @click="$router.go(-1)"
    >
      {{ 'downloads-page.go-back-btn' | globalize }}
    </button>
    <h2 class="downloads__title">
      {{ 'downloads-page.title' | globalize }}
    </h2>

    <div class="downloads__content">
      <section class="downloads__section">
        <h3 class="downloads__section-header">
          {{ 'downloads-page.mobile-apps-header' | globalize }}
        </h3>
        <p class="downloads__section-text">
          {{ 'downloads-page.mobile-apps-desc' | globalize }}
        </p>

        <div class="downloads__phones-wrapper">
          <div class="downloads__phones">
            <div class="downloads__android">
              <img
                class="downloads__phone-img"
                src="@static/android_cropped.png"
              >
              <a
                href="https://play.google.com/store/apps/details?id=org.tokend.template"
                target="_blank"
                rel="noopener"
              >
                <img
                  class="downloads__store-img"
                  src="@static/google_play_cropped.png"
                >
              </a>
            </div>

            <div class="downloads__ios">
              <img
                class="downloads__phone-img"
                src="@static/iphone.png"
              >
              <router-link :to="vueRoutes.iosInstallationGuide">
                <img
                  class="downloads__store-img"
                  src="@static/app_store_cropped.png"
                >
              </router-link>
            </div>
          </div>
          <img
            class="downloads__phones-overlay"
            src="@static/phones_overlay.png"
          >
        </div>

        <hr>
      </section>
      <section class="downloads__section">
        <h3 class="downloads__section-header">
          {{ 'downloads-page.config-header' | globalize }}
        </h3>
        <p class="downloads__section-text">
          {{ 'downloads-page.config-desc' | globalize }}
        </p>
        <qr-code
          class="downloads__config-qr"
          :text="qrConfigText"
          :size="250"
        />
      </section>
    </div>
  </div>
</template>

<script>
import QrCode from 'vue-qr'

import config from '@/config'

import { vueRoutes } from '@/vue-router/routes'

export default {
  name: 'downloads',
  components: {
    QrCode,
  },
  data: _ => ({
    vueRoutes,
  }),
  computed: {
    qrConfigText () {
      const mainPageUrl = window.location.origin

      return JSON.stringify({
        api: config.HORIZON_SERVER,
        storage: config.FILE_STORAGE,
        kyc: `${mainPageUrl}/verification`,
        terms: `${mainPageUrl}/terms`,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import "~@scss/variables";
@import "~@scss/mixins";

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
  @include button();

  padding: 0;
  font-weight: normal;
  font-size: 1.3rem;
}

.downloads__title {
  font-size: 4rem;
  font-weight: normal;
  color: $col-downloads-title;
}

.downloads__content {
  margin-top: 3.5rem;
  border-radius: .2rem;
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

  hr {
    width: 100%;
    margin-top: 4.8rem;
    border: $col-downloads-line solid .05rem;
  }
}

.downloads__section-header {
  font-size: 2.9rem;
  font-weight: normal;
  color: $col-downloads-header;
}

.downloads__section-text {
  font-size: 1.4rem;
  padding-top: .8rem;
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

.downloads__phone-img, .downloads__android, .downloads_ios {
  max-width: 16rem;

  @include respond-to(small) {
    max-width: 100%;
  }
}

.downloads__ios {
  margin-left: 2.9rem;

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

.downloads__config-qr {
  margin-top: 4rem;
}
</style>
