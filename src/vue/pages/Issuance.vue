<template>
  <div class="issuance">
    <top-bar>
      <template slot="main">
        <router-link
          :to="{ name: 'app.issuance' }"
        >
          <span>{{ 'issuance.history-title' | globalize }}</span>
        </router-link>
      </template>

      <template v-if="isAccountCorporate" slot="extra">
        <button
          v-ripple
          class="issuance-btn"
          @click="isPreIssuanceDrawerShown = true"
        >
          {{ 'issuance.upload-pre-issuance-btn' | globalize }}
        </button>

        <button
          v-ripple
          class="issuance-btn"
          @click="isIssuanceDrawerShown = true"
        >
          {{ 'issuance.create-issuance-btn' | globalize }}
        </button>
      </template>
    </top-bar>

    <drawer :is-shown.sync="isPreIssuanceDrawerShown">
      <template slot="heading">
        {{ 'issuance.upload-pre-issuance-btn' | globalize }}
      </template>
      <pre-issuance-form @close="closePreIssuanceDrawer" />
    </drawer>

    <drawer :is-shown.sync="isIssuanceDrawerShown">
      <template slot="heading">
        {{ 'issuance.issuance-form-heading' | globalize }}
      </template>
      <issuance-form @close="closeIssuanceDrawer() || initFirstPageLoader()" />
    </drawer>

    <template v-if="isLoaded">
      <template v-if="issuanceHistory.length">
        <div class="issuance__table app__table app__table--with-shadow">
          <table class="app__table">
            <thead>
              <tr>
                <th :title="'issuance.counterparty-lbl' | globalize">
                  {{ 'issuance.counterparty-lbl' | globalize }}
                </th>
                <th :title="'issuance.amount-lbl' | globalize">
                  {{ 'issuance.amount-lbl' | globalize }}
                </th>
                <th :title="'issuance.asset-code-lbl' | globalize">
                  {{ 'issuance.asset-code-lbl' | globalize }}
                </th>
                <th :title="'issuance.date-lbl' | globalize">
                  {{ 'issuance.date-lbl' | globalize }}
                </th>
                <th :title="'issuance.reference-lbl' | globalize">
                  {{ 'issuance.reference-lbl' | globalize }}
                </th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="issuance in issuanceHistory" :key="issuance.id">
                <td>
                  <email-getter :account-id="issuance.counterparty" />
                </td>

                <td :title="issuance.amount | formatMoney">
                  {{ issuance.amount | formatMoney }}
                </td>

                <td :title="issuance.asset">
                  {{ issuance.asset }}
                </td>

                <td :title="issuance.date | formatCalendar">
                  {{ issuance.date | formatCalendar }}
                </td>

                <td :title="issuance.subject">
                  {{ issuance.subject }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>

      <template v-else>
        <no-data-message
          icon-name="trending-up"
          title-id="issuance.no-issuance-history-title"
          message-id="issuance.no-issuance-history-msg"
        />
      </template>
    </template>

    <template v-else>
      <loader message-id="issuance.loading-msg" />
    </template>

    <collection-loader
      v-show="isLoaded"
      class="issuance__collection-loader"
      :first-page-loader="firstPageLoader"
      @first-page-load="setHistory"
      @next-page-load="extendHistory"
    />
  </div>
</template>

<script>
import Loader from '@/vue/common/Loader'
import Drawer from '@/vue/common/Drawer'
import TopBar from '@/vue/common/TopBar'
import EmailGetter from '@/vue/common/EmailGetter'
import CollectionLoader from '@/vue/common/CollectionLoader'
import NoDataMessage from '@/vue/common/NoDataMessage'

import IssuanceForm from '@/vue/forms/IssuanceForm'
import PreIssuanceForm from '@/vue/forms/PreIssuanceForm'

import { Sdk } from '@/sdk'
import { OP_TYPES } from '@tokend/js-sdk'

import { IssuanceRecord } from '@/js/records/operations/issuance.record'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

export default {
  name: 'issuance',
  components: {
    Loader,
    Drawer,
    TopBar,
    NoDataMessage,
    EmailGetter,
    CollectionLoader,
    IssuanceForm,
    PreIssuanceForm,
  },

  data: _ => ({
    issuanceHistory: [],
    isLoaded: false,
    isIssuanceDrawerShown: false,
    isPreIssuanceDrawerShown: false,
    firstPageLoader: () => {},
  }),

  computed: {
    ...mapGetters({
      accountId: vuexTypes.accountId,
      isAccountCorporate: vuexTypes.isAccountCorporate,
    }),
  },

  created () {
    this.initFirstPageLoader()
  },

  methods: {
    initFirstPageLoader () {
      this.isLoaded = false
      this.issuanceHistory = []
      this.firstPageLoader = this.getFirstPageLoader(this.accountId)
    },

    closeIssuanceDrawer () {
      this.isIssuanceDrawerShown = false
    },

    closePreIssuanceDrawer () {
      this.isPreIssuanceDrawerShown = false
    },

    getFirstPageLoader (accountId) {
      return function () {
        return Sdk.horizon.operations.getPage({
          account_id: accountId,
          operation_type: OP_TYPES.createIssuanceRequest,
        })
      }
    },

    setHistory (data) {
      this.issuanceHistory = data
        .map(issuance => new IssuanceRecord(issuance, this.accountId))
      this.isLoaded = true
    },

    extendHistory (data) {
      this.issuanceHistory = this.issuanceHistory
        .concat(
          data.map(issuance => new IssuanceRecord(
            issuance, this.accountId
          ))
        )
    },
  },
}
</script>

<style lang="scss" scoped>
@import "~@scss/variables";
@import "~@scss/mixins";

.issuance__table {
  width: 100%;
}

.issuance-btn {
  @include button-raised;
}

.issuance__collection-loader {
  margin-top: 1rem;
}
</style>
