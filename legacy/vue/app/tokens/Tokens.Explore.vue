<template>
  <div class="token-wrapper">
    <div class="token-search-form">
      <input-field-unchained
        class="input-field"
        :label="i18n.lbl_token_input_value()"
        v-model="filtrationCriteria"
      />
    </div>

    <div class="tokens">
      <template v-if="!tokens.length && !isLoading">
        <h2 class="app__page-heading">
          {{ i18n.tokens_no_tokens_heading() }}
        </h2>
        <p class="app__page-explanations app__page-explanations--secondary">
          {{ i18n.tokens_no_tokens() }}
        </p>
      </template>

      <template v-if="isLoading">
        <loader :message="i18n.tokens_loading()" />
      </template>

      <div
        class=""
        v-else
      >
        <div class="explore-tokens__inner">
          <div class="explore-tokens__list-wrp">
            <div class="explore-tokens__list">
              <template v-if="filteredTokens.length">
                <md-list class="tokens__md-list md-double-line">
                  <md-content class="tokens__md-scrollbar md-scrollbar">
                    <template v-for="token in filteredTokens">
                      <md-list-item
                        class="tokens__md-list-item"
                        @click="selectToken(token)"
                        :key="`explore-tokens-token-${token.code}`"
                        :class="{
                          'tokens__md-list-item--selected':
                            selected.code === token.code
                        }"
                      >
                        <div
                          class="explore-tokens__list-item-avatar"
                          :class="`${hasBalance(token)
                            ? 'explore-tokens__list-item-avatar--success'
                          : 'explore-tokens__list-item-avatar--default'}`"
                        >
                          <template v-if="token.logoUrl">
                            <img
                              :src="token.logoUrl"
                              :alt="avatar(token.code)"
                            >
                          </template>

                          <template v-else>
                            {{ avatar(token.code) }}
                          </template>
                        </div>

                        <div class="explore-tokens__token-li-details">
                          <span>
                            <span class="explore-tokens__token-code">
                              {{ token.code }}
                            </span>
                            <md-icon
                              class="explore-tokens__balance-exists-icon
                                     md-icon--half-sized"
                              v-if="hasBalance(token)"
                            >
                              check_circle
                            </md-icon>
                          </span>
                          <span class="explore-tokens__token-name">
                            {{ token.name }}
                          </span>
                        </div>
                      </md-list-item>
                    </template>
                  </md-content>
                </md-list>
              </template>
            </div>
          </div>

          <template v-if="selected">
            <div class="explore-tokens__token-ctn">
              <div
                class="app__card-content
                       explore-tokens__token-details">
                <div class="tokens__details-header">
                  <md-avatar
                    class="tokens__details-avatar-icon"
                    :class="`${hasBalance(selected)
                      ? 'tokens__details-avatar-icon--success'
                    : 'tokens__details-avatar-icon--default'}`"
                  >
                    <template v-if="selected.logoUrl">
                      <img
                        :src="selected.logoUrl"
                        :alt="avatar(selected.code)"
                      >
                    </template>

                    <template v-else>
                      {{ avatar(selected.code) }}
                    </template>
                  </md-avatar>
                  <div>
                    <p class="tokens__details-heading">
                      {{ selected.code }}
                    </p>
                    <p class="tokens__details-subheading">
                      {{ selected.name }}
                    </p>
                    <p
                      class="explore-tokens__balance-exists-msg"
                      v-if="hasBalance(selected)"
                    >
                      {{ i18n.lbl_balance_exists() }}
                      <md-icon
                        class="explore-tokens__balance-exists-icon
                               md-icon--half-sized">
                        check_circle
                      </md-icon>
                    </p>
                  </div>
                </div>

                <h4 class="tokens__props-heading">
                  {{ i18n.lbl_token_details() }}
                </h4>
                <div class="explore-tokens__token-details-inner">
                  <table class="app__table-details">
                    <tr>
                      <td>{{ i18n.lbl_code() }}</td>
                      <td>{{ selected.code }}</td>
                    </tr>
                    <tr>
                      <td>{{ i18n.lbl_name() }}</td>
                      <td>
                        {{ selected.name || i18n.tokens_no_name() }}
                      </td>
                    </tr>
                    <tr>
                      <td>{{ i18n.lbl_max_issuance() }}</td>
                      <td>{{ i18n.c(selected.max) }}</td>
                    </tr>
                    <tr>
                      <td>{{ i18n.lbl_issued() }}</td>
                      <td>{{ i18n.c(selected.issued) }}</td>
                    </tr>
                    <tr>
                      <td>{{ i18n.lbl_avalilable_for_iss() }}</td>
                      <td>{{ i18n.c(selected.available) }}</td>
                    </tr>
                    <tr>
                      <td>{{ i18n.lbl_offering_memorandum() }}</td>
                      <td v-if="selected.termsUrl">
                        <a
                          class="tokens__open-doc-link"
                          target="_blank"
                          rel="noopener"
                          :href="selected.termsUrl"
                        >
                          {{ i18n.tokens_open_doc() }}
                        </a>
                      </td>
                      <td v-else>
                        {{ i18n.tokens_no_doc() }}
                      </td>
                    </tr>
                    <tr>
                      <td>{{ i18n.lbl_token_preissued_asset_signer() }}</td>
                      <td>{{ selected.signer }}</td>
                    </tr>
                  </table>
                </div>

                <div class="tokens__actions">
                  <button
                    v-ripple
                    @click="createBalance"
                    v-if="!hasBalance(selected)"
                    class="app__button-raised"
                    :disabled="isPending"
                  >
                    {{ i18n.lbl_add_to_balances() }}
                  </button>
                  <router-link
                    tag="button"
                    :to="{
                      name: 'token-creation.index.code',
                      params: { code: selected.code }
                    }"
                    v-if="isTokenOwner"
                    :disabled="isPending"
                    class="app__button-raised"
                    v-ripple
                  >
                    {{ i18n.lbl_update() }}
                  </router-link>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import formMixin from 'L@/vue/common/mixins/form.mixin'

import { mapGetters, mapActions } from 'vuex'
import { accountsService } from 'L@/js/services/accounts.service'
import { EventDispatcher } from 'L@/js/events/event_dispatcher'
import { ErrorHandler } from 'L@/js/errors/error_handler'
import { vuexTypes } from 'L@/vuex/types'
import { confirmAction } from 'L@/js/modals/confirmation_message'
import { i18n } from 'L@/js/i18n'

import Loader from 'L@/vue/app/common/Loader'
import SubmitterMixin from '../../common/mixins/submitter.mixin'

export default {
  name: 'tokens-explore',
  components: { Loader },
  mixins: [SubmitterMixin, formMixin],
  data: _ => ({
    selected: null,
    isLoading: false,
    filtrationCriteria: '',
    i18n
  }),
  computed: {
    ...mapGetters([
      vuexTypes.accountBalances,
      vuexTypes.tokens,
      vuexTypes.accountId
    ]),
    filteredTokens () {
      return this.filtrationCriteria
        ? this.tokens.filter((token) => {
          const value = this.filtrationCriteria.toLowerCase()
          const name = token.name.toLowerCase()
          const code = token.code.toLowerCase()
          if (code.indexOf(value) !== -1 || name.indexOf(value) !== -1) {
            return token
          }
        })
        : this.tokens || []
    },
    isTokenOwner () {
      return this.selected.owner === this.accountId
    }
  },
  watch: {
    tokens () {
      this.selectToken(this.tokens[0])
    },
    filteredTokens () {
      this.selectToken(this.filteredTokens[0])
    }
  },
  async created () {
    this.selectToken(this.tokens[0])
    this.isLoading = true
    await Promise.all([
      this.loadTokens(),
      this.loadBalances()
    ])
    this.isLoading = false
  },
  methods: {
    ...mapActions({
      loadTokens: vuexTypes.GET_ALL_TOKENS,
      loadBalances: vuexTypes.GET_ACCOUNT_BALANCES
    }),
    selectToken (token) {
      this.selected = token || null
    },
    hasBalance (token) {
      if (!token) return false
      return Object.keys(this.accountBalances).includes(token.code)
    },
    avatar (code) {
      return code.length <= 2 ? code : code.charAt(0)
    },
    async createBalance () {
      if (!await confirmAction()) return
      const code = this.selected.code
      this.disable()
      try {
        await accountsService.createBalance(code)
        await this.loadBalances()
        EventDispatcher.dispatchShowSuccessEvent(
          i18n.cm_balance_created({ code })
        )
      } catch (e) {
        ErrorHandler.processUnexpected(e)
      }
      this.enable()
    },
    goHistory () {
      this.$router.push({
        name: 'history.index',
        params: { tokenCode: this.selected.code }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~L@scss/variables";
@import "~L@scss/mixins";

.token-search-form {
  width: 100%;
  max-width: 260px;
  margin-bottom: 40px;
}

.token-search-form {
  width: 100%;
  max-width: 260px;
  margin-bottom: 40px;
}

.token-search-form {
  width: 100%;
  max-width: 260px;
  margin-bottom: 40px;
}

.explore-tokens__token-ctn {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.explore-tokens__card {
  width: 100%;
}

.explore-tokens__inner {
  display: flex;
  width: 100%;
}

.explore-tokens__list-wrp {
  width: 100%;
  max-width: 55 * $point;
}

.explore-tokens__list {
  .md-content {
    max-height: calc(100vh - 200px);
    overflow: auto;
  }
}

.explore-tokens__token-li-details {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  flex: 1;
  overflow: hidden;

  @include respond-to(small) {
    display: none;
  }
}

.explore-tokens__token-name {
  color: $col-token-name;
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}

.explore-tokens__list-item-avatar {
  width: 40px;
  min-width: 40px;
  max-width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  margin: 4px 16px 4px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $col-token-instead-icon-abbreviation;
  font-size: 24px;

  @include respond-to(small) {
    margin: 0;
  }
}

.explore-tokens__list-item-avatar--success {
  background-color: $col-success;
}

.explore-tokens__list-item-avatar--default {
  background-color: rgb(190, 190, 190);
}

.explore-tokens__token-details {
  width: 100%;
  padding: 0 0 0 3.2 * $point;
  min-width: 10rem;
}

.explore-tokens__balance-exists-icon {
  color: $col-success !important;
  margin-left: 0.15rem;
  position: relative;
  bottom: 0.1rem;
}

.tokens__md-list.md-list {
  padding: 0;
  background-color: transparent;
}
.tokens__md-scrollbar.md-scrollbar {
  background-color: $col-token-list-background;
  box-shadow: inset 0px 0px 20px 0 rgba(0, 0, 0, 0.03);
}

.explore-tokens__token-code {
  color: $col-token-code;
}

.tokens__md-list-item {
  &--selected {
    background-color: $col-token-item-selected-background;
  }
}

.tokens__details-heading {
  padding-left: 1.6 * $point;
  font-size: 2 * $point;
  color: $col-token-code;
}

.tokens__details-subheading {
  padding-left: 1.6 * $point;
  font-size: 1.4 * $point;
  color: $col-token-name;
}

.explore-tokens__balance-exists-msg {
  padding-left: 1.6 * $point;
  font-size: 1.4 * $point;
  color: $col-success;
}

.tokens__details-header {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
}

.tokens__details-avatar-icon {
  @extend .explore-tokens__list-item-avatar;
  margin: 0;
  transition: all 0s;
  &--success {
    background-color: $col-success;
  }

  &--default {
    background-color: rgb(190, 190, 190);
  }
}

.tokens__props-heading {
  color: $col-text-page-heading;
  font-size: 1.4 * $point;
  padding: 0;
  margin: 3 * $point 0 1 * $point 0;
  opacity: 1;
}

.tokens__actions {
  margin-top: 3 * $point;
}

.tokens__open-doc-link {
  text-decoration: underline;
}
</style>
