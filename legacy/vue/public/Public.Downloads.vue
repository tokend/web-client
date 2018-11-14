<template>
  <div
    class="downloads"
    :class="{ 'downloads--public': !isLoggedIn }"
  >
    <template v-if="!isLoggedIn">
      <div class="downloads__header">
        <span class="downloads__title">{{ $route.meta.pageName }}</span>

        <span class="downloads__links">
          <router-link
            class="downloads__link"
            :to="vueRoutes.signup"
          >
            {{ i18n.lbl_signup() }}
          </router-link>
          <router-link
            class="downloads__link"
            :to="vueRoutes.login"
          >
            {{ i18n.lbl_signin() }}
          </router-link>
        </span>
      </div>
    </template>

    <div class="downloads__inner">
      <div class="downloads__android">
        <div class="downloads__android-inner">
          <div class="downloads__android-img">
            <img
              src="../../../static/android.png"
              alt=""
            >
          </div>

          <div class="downloads__android-content">
            <div class="downloads__android-content-section">
              <h1 class="downloads__heading">
                {{ i18n.dl_download_android() }}
              </h1>
              <p class="downloads__paragraph">{{ i18n.dl_about_android() }}</p>
              <a
                class="downloads__pm-link"
                href="https://play.google.com/store/apps/details?id=org.tokend.template"
                target="_blank"
                rel="noopener"
              >
                <img src="../../../static/googleplay.png">
              </a>
            </div>

            <div class="downloads__android-content-section">
              <h1 class="downloads__heading">{{ i18n.dl_use_config() }}</h1>
              <p class="downloads__paragraph">{{ i18n.dl_android_qr() }}</p>
              <qr-code
                :text="qrValue"
                :margin="0"
                :size="175"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="downloads__android">
        <div class="downloads__android-inner">
          <div class="downloads__ios-img">
            <img
              src="../../../static/iphone.png"
              alt=""
            >
          </div>

          <div class="downloads__android-content">
            <div class="downloads__android-content-section">
              <h1 class="downloads__heading">
                {{ i18n.dl_download_ios() }}
              </h1>
              <p class="downloads__paragraph">{{ i18n.dl_about_ios() }}</p>
              <router-link
                class="downloads__pm-link"
                :to="{ name: 'ios-install-guide' }"
              >
                <img src="../../../static/get_on_app_store.svg">
              </router-link>
            </div>

            <div class="downloads__android-content-section">
              <h1 class="downloads__heading">{{ i18n.dl_use_config() }}</h1>
              <p class="downloads__paragraph">{{ i18n.dl_android_qr() }}</p>
              <qr-code
                :text="qrValue"
                :margin="0"
                :size="175"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import QrCode from 'vue-qr'

import { i18n } from '../../js/i18n/index'
import config from '../../../src/config'

import { mapGetters } from 'vuex'
import { vuexTypes } from '../../vuex/types'
import { vueRoutes } from '../../vue-router/const'

export default {
  name: 'public-downloads',
  components: { QrCode },
  data: _ => ({
    i18n,
    vueRoutes
  }),
  computed: {
    ...mapGetters([
      vuexTypes.isLoggedIn
    ]),
    qrValue () {
      const hostname = window.location.hostname

      return JSON.stringify({
        api: config.HORIZON_SERVER,
        storage: config.FILE_STORAGE,
        kyc: `${hostname}/verification`,
        terms: `${hostname}/terms`
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../scss/variables";

$side-padding: 5 * $point;

.downloads--public .downloads__inner {
  padding-left: $side-padding;
}

.downloads__android-img {
  margin-right: 3 * $point;
  max-width: 30 * $point;
  width: 100%;

  img {
    width: 100%;
    display: block;
  }
}

.downloads__ios-img {
  @extend .downloads__android-img;

  & > img {
    display: block;
    max-width: 21 * $point;
    margin: 2rem auto 0;
  }
}

.downloads__header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10 * $point;
  padding: 3 * $point $side-padding;
}

.downloads__title {
  font-size: 2.5 * $point;
}

.downloads__title,
.downloads__link {
  color: $col-primary;
  font-weight: 700;
}

.downloads__link {
  font-size: 1.5 * $point;
}
.downloads__link:first-child {
  margin-right: 2.5 * $point;
}
.downloads__android-inner {
  display: flex;
}
.downloads__android-content {
  padding-top: 2.5 * $point;
  padding-right: 1.5 * $point;
}
.downloads__android-content-section {
  margin-bottom: 6 * $point;
}
.downloads__heading {
  margin-bottom: 1.5 * $point;
  line-height: 1.25;
}
.downloads__paragraph {
  margin-bottom: 1.25 * $point;
  max-width: 40 * $point;
  text-align: justify;
}
.downloads__heading,
.downloads__paragraph {
  color: $col-primary;
}

.downloads__pm-link {
  display: block;
  max-width: 20 * $point;
  width: 100%;
  margin-left: -0.9 * $point;

  img {
    width: 100%;
  }
}
</style>
