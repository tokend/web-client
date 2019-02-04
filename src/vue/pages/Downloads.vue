<template>
  <!-- eslint-disable -->
  <div class="downloads">
    <button
      class="downloads__link"
      @click="$router.go(-1)"
    >
      Go back
    </button>
    <h2 class="downloads__title">
      Downloads
    </h2>
    <div class="downloads__content">
      <section class="downloads__section">
        <h3 class="downloads__section-header">
          All your tokens right on your phone
        </h3>
        <p class="downloads__section-text">
          To access your assets everywhere, get the TokenD app on your mobile device.
        </p>
        <hr>
      </section>
      <section class="downloads__section">
        <h3 class="downloads__section-header">
          One important step
        </h3>
        <p class="downloads__section-text">
          Scan this QR code with your application to provide correct configuration for TokenD environment
        </p>
        <qr-code
          text="qrConfigText"
        />
      </section>
    </div>
  </div>
</template>

<script>
import QrCode from 'vue-qr'

import config from '../../config'

export default {
  name: 'downloads',
  components: {
    QrCode,
  },
  computed: {
    qrConfigText () {
      const hostname = window.location.hostname

      return JSON.stringify({
        api: config.HORIZON_SERVER,
        storage: config.FILE_STORAGE,
        kyc: `${hostname}/verification`,
        terms: `${hostname}/terms`
      })
    }
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
    padding: 3.3rem 8rem;
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
  padding: 5.3rem 10.1rem;

  @include box-shadow();
}

.downloads__section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.downloads__section-header {
  font-size: 2.9rem;
  font-weight: normal;
  color: #3a4180;
}
</style>
