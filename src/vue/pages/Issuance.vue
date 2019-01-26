<template>
  <div>
    <top-bar>
      <template slot="main">
        <router-link
          v-ripple
          :to="{ name: 'app.issuance' }"
        >
          <span>{{ 'issuance.history-title' | globalize }}</span>
        </router-link>
      </template>
      <template
        v-if="account.accountTypeI === ACCOUNT_TYPES.syndicate"
        slot="extra"
      >
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
      <pre-issuance-form @cancel="isPreIssuanceDrawerShown = false" />
    </drawer>
    <drawer :is-shown.sync="isIssuanceDrawerShown">
      <template slot="heading">
        {{ 'issuance.issuance-form-heading' | globalize }}
      </template>
      <issuance-form @cancel="isIssuanceDrawerShown = false" />
    </drawer>
    <div class="issuance" v-if="isLoaded">
      <template v-if="issuanceHistory.length">
        <div class="issuance-history__table">
          <table class="app__table">
            <thead>
              <tr>
                <th>
                  {{ 'issuance.counterparty-lbl' | globalize }}
                </th>
                <th>
                  {{ 'issuance.amount-lbl' | globalize }}
                </th>
                <th>
                  {{ 'issuance.asset-code-lbl' | globalize }}
                </th>
                <th>
                  {{ 'issuance.date-lbl' | globalize }}
                </th>
                <th>
                  {{ 'issuance.reference-lbl' | globalize }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="issuance in issuanceHistory" :key="issuance.id">
                <td>
                  <email-getter :account-id="issuance.counterparty" />
                </td>
                <td>{{ issuance.amount | formatMoney }}</td>
                <td>{{ issuance.asset }}</td>
                <td>{{ issuance.date | formatCalendar }}</td>
                <td>{{ issuance.subject }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
      <template v-else>
        <no-data-message
          icon-name="trending-up"
          :msg-title="'issuance.no-issuance-history-title' | globalize"
          :msg-message="'issuance.no-issuance-history-msg' | globalize"
        />
      </template>
    </div>
    <div v-else>
      <loader
        :message-id="'issuance.loading-msg'"
      />
    </div>
    <div
      v-show="isLoaded"
      class="issuance-history__collection-loader"
    >
      <collection-loader
        :first-page-loader="getHistory"
        @first-page-load="setHistory"
        @next-page-load="extendHistory"
      />
    </div>
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
import { ACCOUNT_TYPES, OP_TYPES } from '@tokend/js-sdk'

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
    ACCOUNT_TYPES,
  }),
  computed: {
    ...mapGetters([
      vuexTypes.account,
    ]),
  },
  methods: {
    async getHistory () {
      const response = await Sdk.horizon.operations.getPage({
        account_id: this[vuexTypes.account].accountId,
        operation_type: OP_TYPES.createIssuanceRequest,
      })
      return response
    },
    setHistory (data) {
      this.issuanceHistory = data.map(issuance => new IssuanceRecord(
        issuance, this[vuexTypes.account].accountId)
      )
      this.isLoaded = true
    },
    extendHistory (data) {
      this.issuanceHistory = this.issuanceHistory
        .concat(data.map(issuance => new IssuanceRecord(
          issuance, this[vuexTypes.account].accountId)
        ))
    },
  },
}
</script>

<style lang="scss" scoped>
@import "~@scss/variables";
@import "~@scss/mixins";

.issuance-history__table {
  overflow-x: auto;
  @include box-shadow();
}

.issuance-btn {
  @include button-raised;
}

.issuance-history__collection-loader {
  margin-top: 1rem;
}
</style>
