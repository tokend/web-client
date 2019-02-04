<template>
  <!-- eslint-disable -->
  <div class="ios-installation-guide">
    <button
      class="ios-installation-guide__link"
      @click="$router.go(-1)"
    >
      Go back
    </button>
    <h2 class="ios-installation-guide__title">
      iOS installation guide
    </h2>
    <div class="ios-installation-guide__content">
      <h3 class="ios-installation-guide__header">
        How to install TokenDwallet app on iOS
      </h3>
      <p class="ios-installation-guide__description">
        Unfortunately, Apple AppStore has a strict and unreliable policy regarding cryptocurrency-related apps. Because of this, we are unable to provide stable application updates through AppStore.
      </p>
      <p class="ios-installation-guide__steps-header">
        In order to install TokenD iOS wallet app follow the next steps:
      </p>

      <div class="ios-installation-guide__steps">
        <div class="ios-installation-guide__step">
          <p class="ios-installation-guide__step-number">
            1
          </p>
          <p class="ios-installation-guide__step-description">
            Download the application with your device.
          </p>
        </div>
        <div class="ios-installation-guide__step">
          <p class="ios-installation-guide__step-number">
            2
          </p>
          <p class="ios-installation-guide__step-description">
            Close browser and wait until the app is downloaded and installed.
          </p>
        </div>
        <div class="ios-installation-guide__step">
          <p class="ios-installation-guide__step-number">
            3
          </p>
         <div class="ios-installation-guide__">
            <p class="ios-installation-guide__step-description">
              On the first attempt to launch the app, you will see a message show on the first image below. Close that dialog and perform next steps (illustrated below for iOS 12). Please make sure you’re connected to the internet.
            </p>

            <div class="ios-installation-guide__img-steps">
              <div class="ios-installation-guide__img-step">
                <img
                  src="@static/images/ios-install-guide/ios-install-guide__1.png" 
                  class="ios-installation-guide__img"
                >
                <p class="ios-installation-guide__img-step-desc">
                  Open “System Preferences”
                </p>
              </div>
              <div class="ios-installation-guide__img-step">
                <img
                  src="@static/images/ios-install-guide/ios-install-guide__2.png" 
                  class="ios-installation-guide__img"
                >
                <p class="ios-installation-guide__img-step-desc">
                  Open “General”
                </p>
              </div>
              <div class="ios-installation-guide__img-step">
                <img
                  src="@static/images/ios-install-guide/ios-install-guide__3.png" 
                  class="ios-installation-guide__img"
                >
                <p class="ios-installation-guide__img-step-desc">
                  Scrool to “Profiles & Device Management”
                </p>
              </div>
              <div class="ios-installation-guide__img-step">
                <img
                  src="@static/images/ios-install-guide/ios-install-guide__4.png" 
                  class="ios-installation-guide__img"
                >
                <p class="ios-installation-guide__img-step-desc">
                  Tab “DISTRIBUTED LAB LP”
                </p>
              </div>
              <div class="ios-installation-guide__img-step">
                <img
                  src="@static/images/ios-install-guide/ios-install-guide__5.png" 
                  class="ios-installation-guide__img"
                >
                <p class="ios-installation-guide__img-step-desc">
                  Tab “Trust DISTRIBUTED LAB LP”
                </p>
              </div>
              <div class="ios-installation-guide__img-step">
                <img
                  src="@static/images/ios-install-guide/ios-install-guide__6.png" 
                  class="ios-installation-guide__img"
                >
                <p class="ios-installation-guide__img-step-desc">
                  Confirm
                </p>
              </div>
            </div>
         </div>

        </div>
        <div class="ios-installation-guide__step">
          <p class="ios-installation-guide__step-number">
            4
          </p>
          <p class="ios-installation-guide__step-description">
            Use the app.
          </p>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'ios-installation-guide',
}
</script>

<style lang="scss" scoped>
@import "~@scss/variables";
@import "~@scss/mixins";

.ios-installation-guide {
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

.ios-installation-guide__link {
  @include button();
  padding: 0;
  font-weight: normal;
  font-size: 1.3rem;
}

.ios-installation-guide__title {
  font-size: 4rem;
  font-weight: normal;
  color: $col-downloads-title;
}

.ios-installation-guide__content {
  margin-top: 3.5rem;
  border-radius: .2rem;
  background-color: $col-downloads-block-bg;
  padding: 2.7rem 2.4rem 4.4rem;

  @include box-shadow();

  @include respond-to($tablet) {
    padding: 2rem;
  }
}

.ios-installation-guide__header {
  font-size: 2rem;
  font-weight: bold;
  color: #3a4180;
}

.ios-installation-guide__description {
  font-size: 1.4rem;
  color: #837fa1;
  margin-top: 1.7rem;
}

.ios-installation-guide__steps-header {
  margin-top: 5rem;
  font-size: 1.4rem;
  color: #3a4180;
}

.ios-installation-guide__step {
  display: flex;
  margin-top: 2.1rem;
}

.ios-installation-guide__step-number {
  background-color: #3a4180;
  font-size: 1rem;
  min-width: 2.3rem;
  height: 2.3rem;
  font-weight: bold;
  text-align: center;
  padding-top: .5rem;
  color: #ffffff;
  border-radius: 50%;
}

.ios-installation-guide__step-description {
  margin-left: 1.6rem;
  padding-top: .4rem;
}

.ios-installation-guide__img-steps {
  display: flex;
  flex-wrap: wrap;
  margin: 2rem -.75rem -.75rem .85rem;

  @include respond-to(small) {
    min-width: 100%;
    margin: 0;
  }
}

.ios-installation-guide__img-step {
  flex: 0 1 15.125%;
  margin: .75rem;
  min-width: 14rem;

  @include respond-to(small) {
    min-width: calc(100% - 1.9rem);
    margin: 1.65rem 1.6rem 0 1.6rem;
  }
}

.ios-installation-guide__img {
  max-width: calc(100% - 1.5rem);

  @include respond-to(small) {
    min-width: 100%;
  }
}

.ios-installation-guide__img-step-desc {
  margin-top: .35rem;
  margin-bottom: 2rem;
  font-size: 1.2rem;
  color: #837fa1;
}
</style>
