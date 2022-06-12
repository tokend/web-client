<template>
  <div class="home-page">
    <div class="home-page__row">
      <div class="home-page__col">
        <app-button :text="$t('open modal')" @click="isModalShown = true" />
        <modal v-model:is-shown="isModalShown">
          {{ $t('Somebody Told me') }}
        </modal>
      </div>
    </div>
    <div class="home-page__row">
      <div class="home-page__col">
        <example-form />
      </div>
      <div class="home-page__col">
        <error-message :message="$t('home-page.loading-error-msg')" />
        <no-data-message :message="$t('home-page.no-data-msg')" />
      </div>
    </div>
    <div class="home-page__row">
      <div class="home-page__col home-page__btns">
        <app-button :text="$t('Home')" :icon-name="$icons.home" />
        <app-button :icon-name="$icons.add" />
        <app-button
          schemes="flat"
          :text="$t('Search')"
          :icon-name="$icons.heart"
        />
        <app-button schemes="flat" :icon-name="$icons.search" />
        <app-button
          schemes="default"
          :text="$t('Database')"
          :icon-name="$icons.check"
        />
        <app-button schemes="default" :icon-name="$icons.database" />
      </div>
      <div class="home-page__col">
        <loader />
      </div>
    </div>
    <div class="home-page__row">
      <div class="home-page__col">
        <icon :name="$icons.folder" />
        <icon :name="$icons.check" />
        <icon :name="$icons.home" />
        <icon :name="$icons.heart" />
        <icon :name="$icons.gift" />
      </div>
      <div class="home-page__col">
        <collapse>
          <template #head="{ collapse }">
            <app-button
              class="home-page__collapse-btn"
              :text="$t('Collapse')"
              @click="collapse.toggle"
            >
            </app-button>
          </template>
          <div class="home-page__collapse-body">
            {{ $t('home-page.collapse-text') }}
          </div>
        </collapse>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  ErrorMessage,
  NoDataMessage,
  AppButton,
  Loader,
  Icon,
  Collapse,
  Modal,
} from '@/common'
import ExampleForm from '@/forms/ExampleForm.vue'

import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'home-page',
  components: {
    Collapse,
    Icon,
    Loader,
    AppButton,
    NoDataMessage,
    ErrorMessage,
    ExampleForm,
    Modal,
  },
  setup() {
    const isModalShown = ref<boolean>(false)

    return {
      isModalShown,
    }
  },
})
</script>

<style lang="scss" scoped>
.home-page__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: toRem(16);
  padding: toRem(16) 0;
}

.home-page__col {
  display: grid;
  grid-gap: toRem(24);
}

.home-page__btns {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}
</style>
