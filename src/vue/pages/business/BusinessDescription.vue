<template>
  <div class="business-description">
    <div class="business-description__wrp">
      <div class="business-details__logo-wrp">
        <img
          class="business-details__logo"
          :src="businessLogoUrl"
        >
      </div>
      <template v-if="business.description">
        <vue-markdown
          class="business-description__markdown"
          :source="business.description"
        />
      </template>
    </div>
  </div>
</template>

<script>
import VueMarkdown from 'vue-markdown'

import { documentsManager } from '@/api'

import { BusinessRecord } from '@/js/records/entities/business.record'

export default {
  name: 'business-description',
  components: {
    VueMarkdown,
  },
  props: {
    business: {
      type: BusinessRecord,
      default: {},
    },
  },
  computed: {
    businessLogoUrl () {
      return documentsManager.getDocumentUrlByKey(this.business.logoKey)
    },
  },
  async created () {
  },
  methods: {},
}
</script>

<style lang="scss" scoped>
  @import '~@/vue/forms/app-form';
  @import '~@scss/variables.scss';
  @import '~@scss/mixins.scss';

  .business-description {
    width: 100%;
    max-width: 100%;
    display: flex;
    justify-content: center;
  }

  .business-description__wrp {
    width: 100%;
    max-width: 100rem;
    display: block;
  }

  .business-details__logo-wrp {
    position: relative;
    padding-bottom: 33.33%;
    margin-bottom: 2rem;
  }

  .business-details__logo {
    position: absolute;
    object-fit: cover;
    width: 100%;
    height: 100%;
  }

</style>

<style lang="scss">
@import '~@scss/variables';
/* stylelint-disable selector-nested-pattern */
.business-description__markdown {
  word-break: break-all;

  img {
    max-width: 100%;
    margin: 0.8rem 0;
  }

  h1 {
    font-size: 2.8rem;
    margin-bottom: 2rem;
    margin-top: 2rem;
  }

  h2 {
    font-size: 2.2rem;
    margin-bottom: 1.4rem;
    margin-top: 1.4rem;
  }

  h3 {
    font-size: 1.8rem;
    margin-bottom: 1rem;
    margin-top: 1rem;
  }

  p {
    margin-bottom: 0.8rem;
  }

  ul {
    // stylelint-disable-next-line
    list-style-type: disc !important;
    padding-left: 1.6rem;
  }

  li {
    // stylelint-disable-next-line
    list-style-type: disc !important;
    margin-bottom: 0.8rem;
  }

  a {
    color: $col-secondary;
  }
}

</style>
