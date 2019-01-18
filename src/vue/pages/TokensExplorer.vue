<template>
  <div class="tokens-explorer">
    <a
      class="token-card"
      v-for="token in tokens"
      :key="token.code"
    >
      <div class="token-card__header">
        <img class="token-card__image" src="https://avatars3.githubusercontent.com/u/17991116?s=88&v=4">
      </div>
      <div class="token-card__info">
        <p class="token-card__code">
          {{ token.code }}
        </p>
        <p class="token-card__name">
          {{ token.details.name }}
        </p>
        <p class="token-card__balance">
          No balance
        </p>
      </div>
    </a>
  </div>
</template>

<script>
import { Sdk } from '@/sdk'

import { ErrorHandler } from '@/js/helpers/error-handler'

export default {
  name: 'tokens-explorer',
  data: _ => ({
    tokens: [],
  }),
  async created () {
    await this.loadTokens()
  },
  methods: {
    async loadTokens () {
      try {
        const { data } = await Sdk.horizon.assets.getAll()
        this.tokens = data
      } catch (e) {
        ErrorHandler.processWithoutFeedback(e)
      }
    }
  },
}
</script>

<style lang="scss" scoped>
@import "~@scss/variables";

.tokens-explorer {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.token-card {
  flex: 0 1 calc(25% - 3rem);
  width: 25.1rem;
  height: 19rem;
  border-radius: .4rem;
  box-shadow: 0 .5rem 1rem 0 rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  margin: 1rem 1.5rem;
}

.token-card__header {
  height: 8.5rem;
  background-color: #3a4180;
  padding-top: 1.5rem;
}

.token-card__info {
  padding: 1.6rem 2rem;
}

.token-card__code {
  font-size: 1.8rem;
  font-weight: bold;
  color: #3a4180;
}

.token-card__name {
  margin-top: .2rem;
  font-size: 1.4rem;
  line-height: 1.29;
  color: #3a4180;
}

.token-card__balance {
  margin-top: 1.2rem;
  font-size: 1.2rem;
  line-height: 1.5;
  color: #837fa1;
}

.token-card__image {
  width: 5.3rem;
  height: 5.3rem;
  border-radius: 50%;
  display: block;
  margin: 0 auto;
}
</style>
