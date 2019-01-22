<template>
  <div class="token-details">
    <div class="asset-details">
      <img
        class="asset-details__logo"
        :src="tokenLogoUrl"
      >
      <div class="asset-details__info">
        <p class="asset-details__code">
          {{ token.code }}
        </p>
        <p class="asset-details__name">
          {{ token.details.name }}
        </p>
      </div>
    </div>
    <table class="app__table token-details__table">
      <tbody>
        <tr v-if="token.balance">
          <td>
            {{ 'token-details.balance-title' | globalize }}
          </td>
          <td>
            {{ token.balance | formatMoney }}
          </td>
        </tr>
        <tr>
          <td>
            {{ 'token-details.maximum-title' | globalize }}
          </td>
          <td>
            {{ token.maxIssuanceAmount | formatMoney }}
          </td>
        </tr>
        <tr>
          <td>
            {{ 'token-details.issued-title' | globalize }}
          </td>
          <td>
            {{ token.issued | formatMoney }}
          </td>
        </tr>
        <tr>
          <td>
            {{ 'token-details.available-title' | globalize }}
          </td>
          <td>
            {{ token.availableForIssuance | formatMoney }}
          </td>
        </tr>
        <tr>
          <td>
            {{ 'token-details.terms-title' | globalize }}
          </td>
          <td>
            <a
              v-if="token.details.terms.key"
              class="token-details__terms"
              :href="tokenTermsUrl">
              {{ 'token-details.download-terms-btn' | globalize }}
            </a>
            <p v-else>
              {{ 'token-details.no-terms-msg' | globalize }}
            </p>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="token-details__buttons">
      <button
        v-ripple
        class="token-details__update-btn"
        :disabled="token.balance"
      >
        {{ 'token-details.add-balance-btn' | globalize }}
      </button>
    </div>
  </div>
</template>

<script>
import config from '@/config'

export default {
  name: 'token-details',
  props: {
    token: { type: Object, required: true },
  },
  computed: {
    tokenLogoUrl () {
      const tokenLogoKey = this.token.details.logo.key
      if (tokenLogoKey) {
        return `${config.FILE_STORAGE}/${tokenLogoKey}`
      } else {
        return '/static/favicon.ico'
      }
    },
    tokenTermsUrl () {
      return `${config.FILE_STORAGE}/${this.token.details.terms.key}`
    },
  },
}
</script>

<style lang="scss" scoped>
@import "~@scss/variables";
@import "~@scss/mixins";

.token-details__table {
  margin-top: 4rem;

  tr td:last-child {
    text-align: right;
  }
}

.token-details__terms {
  font-size: 1.4rem;
  color: #7b6eff;
  text-decoration: none;

  &:visited {
    color: #7b6eff;
  }
}

.token-details__buttons {
  margin-top: 4.9rem;
  display: flex;

  button + button {
    margin-left: auto;
  }
}

.token-details__update-btn {
  @include button-raised();

  margin-bottom: 2rem;
  width: 18rem;
}

.token-details__cancel-btn {
  @include button();

  padding-left: .1rem;
  padding-right: .1rem;
  margin-bottom: 2rem;
  font-weight: normal;
}

.asset-details {
  display: flex;
  align-items: center;

  .asset-details__logo {
    width: 5rem;
    height: 5rem;
    border-radius: 50%
  }

  .asset-details__info {
    margin-left: 1.8rem;

    .asset-details__code {
      font-size: 1.8rem;
      font-weight: bold;
      color: $col-primary;
    }

    .asset-details__name {
      margin-top: .1rem;
      font-size: 1.4rem;
      line-height: 1.29;
      color: $col-primary;
    }
  }
}
</style>
