<template>
  <div class="ios-installation-guide">
    <button
      class="ios-installation-guide__link app__button"
      @click="$router.go(-1)"
    >
      {{ 'ios-installation-guide.go-back-btn' | globalize }}
    </button>
    <h2 class="ios-installation-guide__title">
      {{ 'ios-installation-guide.title' | globalize }}
    </h2>

    <div class="ios-installation-guide__content">
      <h3 class="ios-installation-guide__header">
        {{ 'ios-installation-guide.how-to-install-header' | globalize(
          {
            appName: config.APP_NAME
          })
        }}
      </h3>
      <p class="ios-installation-guide__description">
        {{ 'ios-installation-guide.apple-policy-desc' | globalize }}
      </p>
      <p class="ios-installation-guide__steps-header">
        {{ 'ios-installation-guide.steps-desc' | globalize(
          {
            appName: config.APP_NAME
          })
        }}
      </p>

      <div class="ios-installation-guide__steps">
        <div class="ios-installation-guide__step">
          <p class="ios-installation-guide__step-number">
            1
          </p>
          <vue-markdown
            class="ios-installation-guide__step-description"
            :source="'ios-installation-guide.download-step' | globalize({
              manifestLink
            })"
            :html="false"
          />
        </div>

        <div class="ios-installation-guide__step">
          <p class="ios-installation-guide__step-number">
            2
          </p>
          <p class="ios-installation-guide__step-description">
            {{ 'ios-installation-guide.install-step' | globalize }}
          </p>
        </div>

        <div class="ios-installation-guide__step">
          <p class="ios-installation-guide__step-number">
            3
          </p>
          <div>
            <p class="ios-installation-guide__step-description">
              {{ 'ios-installation-guide.first-launch-step' | globalize }}
            </p>

            <div class="ios-installation-guide__img-steps">
              <div class="ios-installation-guide__img-step">
                <!-- eslint-disable max-len -->
                <img
                  src="@static/images/ios-install-guide/ios-install-guide__1.png"
                  class="ios-installation-guide__img"
                >
                <p class="ios-installation-guide__img-step-desc">
                  {{ 'ios-installation-guide.system-preferences-substep' | globalize }}
                </p>
              </div>

              <div class="ios-installation-guide__img-step">
                <img
                  src="@static/images/ios-install-guide/ios-install-guide__2.png"
                  class="ios-installation-guide__img"
                >
                <p class="ios-installation-guide__img-step-desc">
                  {{ 'ios-installation-guide.general-preferences-substep' | globalize }}
                </p>
              </div>

              <div class="ios-installation-guide__img-step">
                <img
                  src="@static/images/ios-install-guide/ios-install-guide__3.png"
                  class="ios-installation-guide__img"
                >
                <p class="ios-installation-guide__img-step-desc">
                  {{ 'ios-installation-guide.device-management-substep' | globalize }}
                </p>
              </div>

              <div class="ios-installation-guide__img-step">
                <img
                  src="@static/images/ios-install-guide/ios-install-guide__4.png"
                  class="ios-installation-guide__img"
                >
                <p class="ios-installation-guide__img-step-desc">
                  {{ 'ios-installation-guide.distributed-lab-lp-substep' | globalize }}
                </p>
              </div>

              <div class="ios-installation-guide__img-step">
                <img
                  src="@static/images/ios-install-guide/ios-install-guide__5.png"
                  class="ios-installation-guide__img"
                >
                <p class="ios-installation-guide__img-step-desc">
                  {{ 'ios-installation-guide.trust-substep' | globalize }}
                </p>
              </div>

              <div class="ios-installation-guide__img-step">
                <img
                  src="@static/images/ios-install-guide/ios-install-guide__6.png"
                  class="ios-installation-guide__img"
                >
                <!-- eslint-enable max-len -->
                <p class="ios-installation-guide__img-step-desc">
                  {{ 'ios-installation-guide.confirm-substep' | globalize }}
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
            {{ 'ios-installation-guide.use-app-step' | globalize }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueMarkdown from 'vue-markdown'
import config from '@/config'

export default {
  name: 'ios-installation-guide',
  components: {
    VueMarkdown,
  },
  data () {
    return {
      manifestLink: config.IOS_MANIFEST_LINK,
      config,
    }
  },
}
</script>

<style lang="scss">
@import '~@scss/variables';
@import '~@scss/mixins';

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
  padding: 0;
  font-weight: 400;
  font-size: 1.3rem;
}

.ios-installation-guide__title {
  font-size: 4rem;
  font-weight: 400;
  color: $col-ios-guide-title;
}

.ios-installation-guide__content {
  margin-top: 3.5rem;
  padding: 2.7rem 2.4rem 4.4rem;
  border-radius: 0.2rem;
  background-color: $col-ios-guide-block-bg;

  @include box-shadow;
  @include respond-to($tablet) {
    padding: 2rem;
  }
}

.ios-installation-guide__header {
  font-size: 2rem;
  font-weight: 700;
  color: $col-ios-guide-header;
}

.ios-installation-guide__description {
  font-size: 1.4rem;
  color: $col-ios-guide-text;
  margin-top: 1.7rem;
}

.ios-installation-guide__steps-header {
  margin-top: 5rem;
  font-size: 1.4rem;
  color: $col-ios-guide-step-text;
}

.ios-installation-guide__step {
  display: flex;
  margin-top: 2.1rem;
}

.ios-installation-guide__step-number {
  background-color: $col-ios-guide-step-number-bg;
  color: $col-ios-guide-step-number-text;
  font-size: 1rem;
  font-weight: 700;
  text-align: center;
  min-width: 2.3rem;
  height: 2.3rem;
  padding-top: 0.5rem;
  border-radius: 50%;
}

// Disabled because vue-markdown
/* stylelint-disable selector-nested-pattern */
.ios-installation-guide__step-description {
  margin-left: 1.6rem;
  padding-top: 0.4rem;

  a {
    color: $col-ios-guide-link;
  }
}
/* stylelint-enable selector-nested-pattern */

.ios-installation-guide__img-steps {
  display: flex;
  flex-wrap: wrap;
  margin: 2rem -0.75rem -0.75rem 0.85rem;

  @include respond-to(small) {
    min-width: 100%;
    margin: 0;
  }
}

.ios-installation-guide__img-step {
  flex: 0 1 15.125%;
  margin: 0.75rem;
  min-width: 14rem;

  @include respond-to(small) {
    min-width: calc(100% - 1.9rem);
    margin: 1.65rem 1.6rem 0;
  }
}

.ios-installation-guide__img {
  max-width: calc(100% - 1.5rem);

  @include respond-to(small) {
    min-width: 100%;
  }
}

.ios-installation-guide__img-step-desc {
  margin-top: 0.35rem;
  margin-bottom: 2rem;
  font-size: 1.2rem;
  color: $col-ios-guide-substep-text;
}
</style>
