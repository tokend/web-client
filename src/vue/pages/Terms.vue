<template>
  <div class="terms">
    <a class="terms__link">
      Go back
    </a>
    <p class="terms__title">
      Terms & conditions
    </p>
    <div class="terms__content">
      <div class="terms__content-table">
        <p class="terms__content-table-title">
          Table of contents
        </p>
        <ul class="terms__content-table-list">
          <li class="terms__content-table-list-item">
            Customer agreement
          </li>
          <li class="terms__content-table-list-item">
            Customer agreement
          </li>
          <li class="terms__content-table-list-item">
            Customer agreement
          </li>
          <li class="terms__content-table-list-item">
            Customer agreement
          </li>
          <li class="terms__content-table-list-item">
            Customer agreement
          </li>
          <li class="terms__content-table-list-item">
            Customer agreement
          </li>
          <li class="terms__content-table-list-item">
            Customer agreement
          </li>
        </ul>
      </div>
      <div class="terms__content-main">
        <div class="terms__content-section">
          <p class="terms__content-paragraph">
            Lorem ipsum
          </p>
        </div>
        <div class="terms__content-section">
          <p class="terms__content-section-header">
            Customer agreement
          </p>
          <p class="terms__content-paragraph">
            Lorem ipsum
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
@import "~@scss/variables";
@import "~@scss/mixins";

.terms {
  padding: 3.3rem 19.5rem;
}

.terms__title {
  margin-top: .9rem;
  font-size: 4rem;
  color: #3a4180;
}

.terms__content {
  margin-top: 3.5rem;
  border-radius: .2rem;
  background-color: #ffffff;
  padding: 3.2rem 2.5rem;
  @include box-shadow();
}

.terms__content-table-title {
  font-size: 2rem;
  font-weight: bold;
  color: #3a4180;
}

.terms__content-table-list {
  margin-top: 1.6rem;

  &-item {
    display: flex;
    align-items: center;

    &::before {
      content: "\2022";
      color: #c1bfd0;
      font-size: .8rem;
      margin-right: .9rem;
      margin-top: -.25rem;
    }
  }
}

.terms__content-main {
  margin-top: 4rem;
}

.terms__content-section {
  margin-top: 2.6rem;
}

.terms__content-paragraph {
  padding-bottom: 1.4rem;
  font-size: 1.4rem;
  color: #837fa1;
}

.terms__content-section-header {
  font-size: 1.4rem;
  font-weight: bold;
  color: #3a4180;
}
</style>
