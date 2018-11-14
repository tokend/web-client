<template>
  <div class="upload-preissuance app__page-content-wrp">
    <h2 class="app__page-heading">
      {{ i18n.preis_heading() }}
    </h2>
    <p class="app__page-explanations">
      <markdown :source="i18n.preis_upload_tip()" />
    </p>
    <template v-if="tokens.length">
      <div class="preissuance-form__upload-wrp">
        <file-field
          class="preissuance-form__upload-input"
          v-model="documents.preissuance"
          label="Select File(s)"
          accept=".iss"
          id="preissuance-field"
        />
      </div>
    </template>
    <template v-else>
      <p>{{ i18n.lbl_loading() }}</p>
    </template>
    <ul
      class="preissuance-form__list"
      v-if="issuances.length">
      <p>{{ i18n.lbl_to_upload() }}</p>

      <li
        v-for="(item, index) in issuances"
        :key="item.reference">
        {{ index + 1 }}. {{ i18n.c(item.amount) }} {{ item.asset }}
      </li>
    </ul>

    <div
      class="app__form-actions"
      v-if="issuances.length">
      <button
        v-ripple
        @click="submit"
        class="app__button-raised"
        :disabled="isPending">
        {{ i18n.lbl_upload() }}
      </button>
      <button
        v-ripple
        @click="clear"
        class="app__button-flat"
        :disabled="isPending">
        {{ i18n.lbl_clear() }}
      </button>
    </div>
  </div>
</template>

<script>
import { i18n } from 'L@/js/i18n'
import { mapGetters, mapActions } from 'vuex'
import { vuexTypes } from 'L@/vuex/types'
import { EventDispatcher } from 'L@/js/events/event_dispatcher'
import { ErrorHandler } from 'L@/js/errors/error_handler'
import { issuanceService } from 'L@/js/services/issuances.service'
import { FileHelper } from 'L@/js/helpers/file.helper'
import { PreIssuanceRequest, xdr } from 'tokend-js-sdk'
import FormMixin from 'L@/vue/common/mixins/form.mixin'
import FileField from 'L@/vue/common/fields/FileField'
import Markdown from 'L@/vue/app/common/Markdown'
import config from '@/config'

export default {
  components: {
    FileField,
    Markdown
  },
  mixins: [FormMixin],
  data: _ => ({
    documents: {
      preissuance: null
    },
    issuances: [],
    i18n
  }),
  computed: {
    ...mapGetters([
      vuexTypes.accountId,
      vuexTypes.tokens
    ]),
    userOwnedTokens () {
      return this.tokens.filter(token => token.owner === this.accountId)
    }
  },
  watch: {
    'documents.preissuance': async function (value) {
      if (value) {
        const extracted = await FileHelper.readFileAsText(value.file)
        this.parsePreIssuances(JSON.parse(extracted).issuances)
      }
    }
  },
  created () {
    this.loadTokens()
  },
  methods: {
    ...mapActions({
      loadTokens: vuexTypes.GET_ALL_TOKENS
    }),

    parsePreIssuances (issuances) {
      this.issuances = []
      const items = issuances
        .map(function (item) {
          const _xdr = xdr.PreIssuanceRequest.fromXDR(item.preEmission, 'hex')
          const result = PreIssuanceRequest.dataFromXdr(_xdr)

          result.xdr = _xdr
          result.isUsed = item.used

          return result
        }).filter(item => {
          return !this.issuances.find(el => el.reference === item.reference)
        })

      for (let i = 0; i < items.length; i++) {
        const assetCode = items[i].asset
        if (!this.isAssetDefined(assetCode)) {
          EventDispatcher.dispatchShowErrorEvent(
            i18n.preis_token_not_exist({ asset: assetCode })
          )
          return
        }
      }
      this.issuances = this.issuances.concat(items)
    },
    isAssetDefined (assetCode) {
      return !!this.userOwnedTokens
        .filter(item => item.code === assetCode).length
    },

    isNullAssetSigner (asset) {
      const nullSigner = this.userOwnedTokens.filter(item =>
        item.signer === config.NULL_ASSET_SIGNER
      )
      return !!nullSigner.filter(item => item.code === asset).length
    },

    clear () {
      this.issuances = []
      this.documents.preissuance = null
    },

    async submit () {
      this.disable()
      try {
        for (let item of this.issuances) {
          if (this.isNullAssetSigner(item.asset)) {
            EventDispatcher.dispatchShowErrorEvent(
              i18n.preis_token_not_available({ asset: item.asset })
            )
            this.enable()
            return
          }
          await issuanceService.createPreIssuanceRequest(
            this.issuances.map(item => item.xdr)
          )
          this.$router.push({
            path: '/requests',
            hash: '#pre-issuance-upload'
          })
          EventDispatcher.dispatchShowSuccessEvent(i18n.preis_uploaded())
        }
        this.issuances = []
      } catch (err) {
        ErrorHandler.processUnexpected(err)
      }
      this.enable()
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~L@scss/mixins";
  @import "~L@scss/variables";

  .preissuance-form__upload-wrp {
    margin-top: 1rem;
  }

  .preissuance-form__list {
    margin-top: 2rem;
    list-style-type: none;
    color: $col-list-text;
  }
</style>
