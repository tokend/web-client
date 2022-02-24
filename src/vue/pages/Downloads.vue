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
          {{ 'downloads-page.mobile-apps-desc' | globalize(
            {
              appName: config.APP_NAME
            })
          }}
        </p>

        <div class="downloads__phones-wrapper">
          <div class="downloads__phones">
            <div
              class="downloads__android"
              v-if="config.PLAY_MARKET_LINK"
            >
              <img
                class="downloads__phone-img"
                src="@static/android_cropped.png"
              >
              <a
                :href="config.PLAY_MARKET_LINK"
                target="_blank"
                rel="noopener"
              >
                <img
                  class="downloads__store-img"
                  src="@static/google_play_cropped.png"
                >
              </a>
            </div>

            <div
              class="downloads__ios"
              v-if="config.IOS_MANIFEST_LINK"
            >
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

      <section
        class="downloads__section"
        v-if="config.OFFLINE_ISSUANCE_WIN_LINK ||
          config.OFFLINE_ISSUANCE_MAC_LINK ||
          config.OFFLINE_ISSUANCE_SOURCE_LINK
        "
      >
        <h3 class="downloads__section-header">
          {{ 'downloads-page.pre-issuance-apps-header' | globalize }}
        </h3>

        <p class="downloads__section-text">
          {{ 'downloads-page.pre-issuance-apps-desc' | globalize }}
          <router-link :to="vueRoutes.preIssuanceGuide">
            {{ 'downloads-page.pre-issuance-learn-more-link' | globalize }}
          </router-link>
        </p>

        <div class="downloads__operation-systems-wrapper">
          <img
            class="downloads__pre-issuance-app-img"
            src="@static/pre-issuance-app.png"
          >
          <div class="downloads__operation-systems">
            <div
              class="downloads__windows"
              v-if="config.OFFLINE_ISSUANCE_WIN_LINK"
            >
              <a
                :href="config.OFFLINE_ISSUANCE_WIN_LINK"
                target="_blank"
                rel="noopener"
              >
                <img
                  class="downloads__os-store-img"
                  src="@static/windows_cropped.png"
                >
              </a>
            </div>

            <div
              class="downloads__macosx"
              v-if="config.OFFLINE_ISSUANCE_MAC_LINK"
            >
              <a
                :href="config.OFFLINE_ISSUANCE_MAC_LINK"
                target="_blank"
                rel="noopener"
              >
                <img
                  class="downloads__os-store-img"
                  src="@static/macosx_cropped.png"
                >
              </a>
            </div>
          </div>

          <template v-if="config.OFFLINE_ISSUANCE_SOURCE_LINK">
            <a
              :href="config.OFFLINE_ISSUANCE_SOURCE_LINK"
              class="downloads__source-code-link"
              target="_blank"
              rel="noopener"
            >
              {{ 'downloads-page.pre-issuance-app-sources-link' | globalize }}
            </a>
          </template>
        </div>

        <hr>
      </section>

      <section class="downloads__section">
        <h3 class="downloads__section-header">
          {{ 'downloads-page.config-header' | globalize }}
        </h3>
        <p class="downloads__section-text">
          {{ 'downloads-page.config-desc' | globalize(
            {
              appName: config.APP_NAME
            })
          }}
        </p>
        <qr-code-wrapper
          class="downloads__config-qr"
          :value="qrConfigText"
          :size="250"
        />
      </section>
    </div>
  </div>
</template>

<script>
import QrCodeWrapper from '@/vue/common/QrCodeWrapper'

import config from '@/config'

import { vueRoutes } from '@/vue-router/routes'

export default {
  name: 'downloads',
  components: {
    QrCodeWrapper,
  },
  data: _ => ({
    vueRoutes,
    config,
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

  @include box-shadow;
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

.downloads__operation-systems-wrapper {
  height: 47rem;

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

.downloads__pre-issuance-app-img {
  display: block;
  max-width: 52.7rem;

  @include respond-to(small) {
    max-width: 46.7rem;
  }
  @include respond-to(xsmall) {
    width: 100%;
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

.downloads__operation-systems {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 0.9rem;
}

.downloads__source-code-link {
  color: $col-downloads-link;
}

.downloads__phone-img,
.downloads__android,
.downloads__ios,
.downloads__windows,
.downloads__macosx {
  max-width: 16rem;

  @include respond-to(small) {
    max-width: 100%;
  }
}

.downloads__ios,
.downloads__macosx {
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

.downloads__os-store-img {
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
