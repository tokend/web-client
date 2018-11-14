<template>
  <div class="user-type-selector">
    <div class="app__card user-type-selector__user md-layout-item md-size-30">
      <div class="app__card-header user-type-selector__card-header">
        <span class="user-type-selector__user-title md-title">
          {{ i18n.kyc_general() }}
        </span>
        <md-icon>
          info
          <md-tooltip md-direction="top">{{ i18n.kyc_inv_tip() }}</md-tooltip>
        </md-icon>
      </div>
      <div class="app__card-content user-type-selector__user-content">
        <md-icon
          class="md-size-5x
                 md-medium-size-3x
                 user-type-selector__user-icon">
          person
        </md-icon>
      </div>
      <div class="user-type-selector__actions">
        <button
          v-ripple
          @click="selectType(userTypes.general)"
          class="app__button-raised user-type-selector__user-button"
          :disabled="isPending">
          {{ i18n.kyc_apply_general() }}
        </button>
      </div>
    </div>
    <div class="app__card user-type-selector__user md-layout-item md-size-30">
      <div class="app__card-header user-type-selector__card-header">
        <span class="md-title">{{ i18n.kyc_corporate() }}</span>
        <md-icon>
          info
          <md-tooltip md-direction="top">
            {{ i18n.kyc_corporate_tip() }}
          </md-tooltip>
        </md-icon>
      </div>
      <div class="app__card-content user-type-selector__user-content">
        <md-icon
          class="md-size-5x
                 md-medium-size-3x
                 user-type-selector__user-icon">
          domain
        </md-icon>
      </div>
      <div class="user-type-selector__actions">
        <button
          v-ripple
          @click="selectType(userTypes.syndicate)"
          class="app__button-raised user-type-selector__user-button"
          :disabled="isPending">
          {{ i18n.kyc_apply_corporate() }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { commonEvents } from 'L@/js/events/common_events'
import { userTypes } from 'L@/js/const/const'
import { i18n } from 'L@/js/i18n/index'

export default {
  name: 'user-type-selector',
  props: {
    isPending: { type: Boolean, default: false }
  },
  data () {
    return {
      i18n,
      userTypes,
      events: {
        selectUserType: commonEvents.selectUserTypeEvent
      }
    }
  },
  methods: {
    selectType (type) {
      this.$emit(this.events.selectUserType, type)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '~L@scss/variables';
  @import '~L@scss/mixins';

  .user-type-selector {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;

    @include respond-to-custom(1130px) {
      max-width: 860px;
    }

    @include respond-to-custom(960px) {
      flex-direction: column;
    }
  }

  .user-type-selector__heading {
    text-align: center;
  }

  .user-type-selector__card-header {
    align-items: center;
    display: flex;
    justify-content: space-between;

    .md-icon {
      position: relative;
      bottom: .2rem;
      margin: 0;
    }
  }

  .user-type-selector__user-btn {
    align-items: center;
    border-radius: 3px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    padding: 20px 40px;
    transition: .2s;
    background-color: transparent;

    i {
      font-size: $size-icon-super-big;
    }

    &:hover {
      background-color: lighten($col-unfocused, 30%);
    }
  }

  .user-type-selector__user {
    min-width: 280px;
    margin: auto;

    @include respond-to-custom(960px) {
      &:not(:last-child) {
        margin-bottom: 16px;
      }
    }

    .user-type-selector__user-title {
      white-space: nowrap;
    }

    .user-type-selector__user-content {
      display: flex;
      justify-content: center;
      position: relative;
    }

    .user-type-selector__user-icon--secondary {
      position: absolute;
      right: 3.5rem;
      top: 1rem;

    }
  }

  .user-type-selector__user {
    font-size: 1rem;
    margin: 0 16px;
  }

  .user-type-selector__actions {
    text-align: center;
    margin-bottom: 3 * $point;
  }
</style>
