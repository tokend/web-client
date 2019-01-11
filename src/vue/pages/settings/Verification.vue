<template>
  <div class="verification">
    <div class="request-message request-message--approved">
      <p class="request-message__content">
        {{ 'verification-page.approved-request-message' | globalize }}
      </p>
    </div>
    <div class="account-type">
      <p class="verification__label">
        {{ 'verification-page.account-type-lbl' | globalize }}
      </p>
      <div class="account-type__wrapper">
        <router-link
          :to="{ name: 'app.verification.general' }"
          class="account-type__item"
        >
          <p class="account-type__item-title">
            {{ 'verification-page.account-type-general-title' | globalize }}
          </p>
          <p class="account-type__item-description">
            {{ 'verification-page.account-type-general-description'
              | globalize }}
          </p>
          <div class="account-type__selected-icon">
            <i class="mdi mdi-check" />
          </div>
        </router-link>
        <router-link
          :to="{ name: 'app.verification.corporate' }"
          class="account-type__item"
        >
          <p class="account-type__item-title">
            {{ 'verification-page.account-type-corporate-title' | globalize }}
          </p>
          <p class="account-type__item-description">
            {{ 'verification-page.account-type-corporate-description'
              | globalize }}
          </p>
          <div class="account-type__selected-icon">
            <i class="mdi mdi-check" />
          </div>
        </router-link>
      </div>
    </div>
    <div
      v-if="$route.name !== 'app.verification'"
      class="verification__form"
    >
      <p class="verification__label verification__form-label">
        {{ 'verification-page.account-information-lbl' | globalize }}
      </p>
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: 'verification'
}
</script>

<style lang="scss" scoped>
@import "~@scss/variables";
@import "~@scss/mixins";

.request-message {
  min-height: 6.4rem;
  width: 100%;

  @mixin apply-theme ($col-msg-background) {
    background-color: $col-msg-background;
  }

  &--approved { @include apply-theme($col-request-approved) }
  &--pending { @include apply-theme($col-request-pending) }
  &--rejected { @include apply-theme($col-request-rejected) }
}

.request-message__content {
  padding: 2.4rem;
  font-size: 1.3rem;
  font-weight: normal;
  color: $col-primary-txt;
}

.account-type {
  margin-top: 4rem;
}

.verification__label {
  color: $col-primary;
  font-size: 1.3rem;
}

.account-type__wrapper {
  margin-top: 1rem;
  display: flex;

  & > :not(:first-child) {
    margin-left: 1.6rem;
  }
}

.account-type__item {
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 25.4rem;
  height: 14.7rem;
  padding: 3.2rem;
  // FIXME shadow color
  box-shadow: 0 .6rem 1rem 0 rgba(0, 0, 0, 0.1);
  background-color: $col-block-bg;
  text-decoration: none;
}

.router-link-exact-active {
  border: .2rem solid $col-primary-lighten;

  .account-type__selected-icon {
    visibility: visible;
  }
}

.account-type__item-title {
  color: $col-primary;
  font-size: 1.8rem;
}

.account-type__item-description {
  margin-top: .8rem;
  color: $col-secondary;
  font-size: 1.2rem;
  text-align: center;
}

.account-type__selected-icon {
  width: 2.4rem;
  height: 2.4rem;
  padding: .2rem;
  background-color: $col-block-bg;
  border: .2rem solid $col-primary-lighten;
  border-radius: 2rem;
  top: -1.2rem;
  right: -1.2rem;
  position: absolute;
  visibility: hidden;

  i {
    font-size: 1.6rem;
    color: $col-primary-lighten;
  }
}

.verification__form-label {
  margin-top: 4rem;
  margin-bottom: 1rem;
}
</style>
