<template>
  <div class="pre-issuance-guide">
    <button
      class="pre-issuance-guide__link app__button"
      @click="$router.go(-1)"
    >
      {{ 'pre-issuance-guide.go-back-btn' | globalize }}
    </button>
    <h2 class="pre-issuance-guide__title">
      {{ 'pre-issuance-guide.title' | globalize }}
    </h2>
    <div class="pre-issuance-guide__content">
      <vue-markdown
        class="pre-issuance-guide__markdown"
        :source="'pre-issuance-guide.guide' | globalize"
        :html="true"
      />
    </div>
  </div>
</template>

<script>
import VueMarkdown from 'vue-markdown'

export default {
  name: 'pre-issuance-guide',
  components: {
    VueMarkdown,
  },
}
</script>

<style lang="scss">
@import '~@scss/variables';
@import '~@scss/mixins';

.pre-issuance-guide {
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

.pre-issuance-guide__link {
  padding: 0;
  font-weight: 400;
  font-size: 1.3rem;
}

.pre-issuance-guide__title {
  font-size: 4rem;
  font-weight: 400;
  color: $col-pre-issuance-guide-title;
}

.pre-issuance-guide__content {
  margin-top: 3.5rem;
  border-radius: 0.2rem;
  background-color: $col-pre-issuance-guide-block-bg;
  padding: 3.2rem 2.5rem;

  @include box-shadow;
}

/* stylelint-disable selector-nested-pattern */
.pre-issuance-guide__markdown {
  h3 {
    font-size: 2rem;
    font-weight: 700;
    color: $col-pre-issuance-guide-header;
  }

  ul {
    margin-top: 1.6rem;
    margin-bottom: 4rem;

    li {
      display: flex;
      align-items: center;
      color: $col-pre-issuance-guide-header;
      padding: 0.6rem 0;
      text-decoration: none;
      width: fit-content;

      &:before {
        content: '\2022';
        color: $col-pre-issuance-guide-list-item;
        font-size: 0.8rem;
        margin: -0.25rem 0.9rem 0 0.4rem;
      }

      a:visited {
        color: $col-primary;
      }
    }
  }

  p {
    padding-bottom: 1.4rem;
    font-size: 1.4rem;
    color: $col-text;
  }

  h4 {
    margin-top: 2.6rem;
    font-size: 1.4rem;
    padding-top: 0;
    padding-bottom: 0.3rem;
    opacity: 1;
    font-weight: 700;
    color: $col-pre-issuance-guide-header;
  }

  img {
    max-width: 74.7rem;
    display: block;
    margin: 0 auto;

    @include respond-to(medium) {
      max-width: 46.7rem;
    }
    @include respond-to(small) {
      width: 100%;
    }
  }

  table,
  th,
  td {
    border: 0.1rem solid $col-pre-issuance-guide-header;
  }

  table {
    border-collapse: collapse;
    margin: 0 auto 1rem;
    font-size: 1.4rem;

    th {
      padding: 0.5rem;
    }

    td {
      text-align: center;
      padding: 1rem;
      word-break: break-word;
    }
  }

  .pre-issuance-guide__img-wrapper {
    display: flex;
    flex-direction: column;
    margin-top: 1rem;

    img {
      @include box-shadow;
    }
  }
}
/* stylelint-enable selector-nested-pattern */
</style>
