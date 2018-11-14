<template>
  <div class="ios-guide">
    <div class="ios-guide__inner">
      <div class="ios-guide__logo-wrp">
        <logotype class="ios-guide__logo" />
      </div>

      <h1 class="ios-guide__heading">
        {{ 'ios_install_guide_heading' | translate }}
      </h1>

      <p class="ios-guide__paragraph">
        {{ 'ios_install_guide_intro' | translate }}
      </p>

      <p class="ios-guide__paragraph ios-guide__paragraph--gap-top">
        {{ 'ios_install_guide_steps_title' | translate }}
      </p>

      <p class="ios-guide__paragraph ios-guide__paragraph--small-gap-top">
        <markdown :source="'ios_install_guide_step_1' | translate" />
      </p>

      <p class="ios-guide__paragraph ios-guide__paragraph--small-gap-top">
        <markdown :source="'ios_install_guide_step_2' | translate" />
      </p>

      <p class="ios-guide__paragraph ios-guide__paragraph--small-gap-top">
        <markdown :source="'ios_install_guide_step_3' | translate" />
      </p>

      <div class="ios-guide__screenshots">
        <div class="ios-guide__screenshot-wrp">
          <img src="/static/images/ios-install-guide/ios-install-guide__1.png">
        </div>
        <div class="ios-guide__screenshot-wrp">
          <img src="/static/images/ios-install-guide/ios-install-guide__2.png">
        </div>
        <div class="ios-guide__screenshot-wrp">
          <img src="/static/images/ios-install-guide/ios-install-guide__3.png">
        </div>
        <div class="ios-guide__screenshot-wrp">
          <img src="/static/images/ios-install-guide/ios-install-guide__4.png">
        </div>
        <div class="ios-guide__screenshot-wrp">
          <img src="/static/images/ios-install-guide/ios-install-guide__5.png">
        </div>
        <div class="ios-guide__screenshot-wrp">
          <img src="/static/images/ios-install-guide/ios-install-guide__6.png">
        </div>
      </div>

      <p class="ios-guide__paragraph ios-guide__paragraph--gap-top">
        <markdown :source="'ios_install_guide_step_4' | translate" />
      </p>
    </div>
  </div>
</template>

<script>
import Markdown from 'L@/vue/app/common/Markdown'
import Logotype from 'L@/vue/app/common/Logotype'
export default {
  name: 'ios-install-guide',
  components: { Markdown, Logotype }
}
</script>

<style lang="scss">
@import "~L@scss/variables";
@import "~L@scss/mixins";

.ios-guide {
  padding: 4 * $point $content-side-paddings;

  @include respond-to(small) {
    padding: 3 * $point $content-side-paddings-sm;
  }
}

.ios-guide__heading {
  color: $col-heading;
  line-height: 1.25;
  margin-bottom: 1.5 * $point;
}

.ios-guide__paragraph {
  font-size: 1.6 * $point;
  line-height: 1.5;

  a[href] {
    text-decoration: underline;
  }

  ol {
    padding-left: 1.7 * $point;
  }

  li {
    list-style-type: decimal !important;
  }

  &--gap-top {
    margin-top: 1.6 * $point;
  }

  &--small-gap-top {
    margin-top: 0.4 * $point;
  }
}

.ios-guide__logo {
  display: inline-block;
  margin-bottom: 4 * $point;
  max-width: 13 * $point;
  width: 100%;

  & > img {
    display: block;
    width: 100%;
    height: auto;
  }
}

.ios-guide__screenshots {
  $img-margin: 2 * $point;

  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  margin: 1.6 * $point + (-1.5 * $img-margin) 0 0 (-$img-margin);

  & > .ios-guide__screenshot-wrp {
    min-width: 200px;
    padding: 1.5 * $img-margin 0 0 $img-margin;

    & > img {
      box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.15);
    }

    flex: calc(1 / 6);
    min-width: calc(100% / 6);
    max-width: calc(100% / 6);

    @include respond-to(xmedium) {
      flex: calc(1 / 4);
      min-width: calc(100% / 4);
      max-width: calc(100% / 4);
    }

    @include respond-to(medium) {
      flex: calc(1 / 3);
      min-width: calc(100% / 3);
      max-width: calc(100% / 3);
    }

    @include respond-to(small) {
      flex: calc(1 / 2);
      min-width: calc(100% / 2);
      max-width: calc(100% / 2);
    }

    @include respond-to(xsmall) {
      flex: calc(1 / 1);
      min-width: calc(100% / 1);
      max-width: calc(100% / 1);
    }
  }
}
</style>
