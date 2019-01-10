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
        {{ 'issuance.create-issuance-btn' | globalize }}
      </template>
      <issuance-form @cancel="isIssuanceDrawerShown = false" />
    </drawer>
    <div class="issuance" v-if="isLoaded">
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
    </div>
    <div v-else-if="!isLoadingFailed">
      <loader
        :message-id="'issuance.loading-lbl'"
      />
    </div>
    <div v-else>
      <p>
        {{ 'issuance.loading-error-lbl' | globalize }}
      </p>
    </div>
  </div>
</template>

<script>
import Loader from '@/vue/common/Loader'
import Drawer from '@/vue/common/Drawer'
import TopBar from '@/vue/common/TopBar'
import EmailGetter from '@/vue/common/EmailGetter'

import IssuanceForm from '@/vue/forms/IssuanceForm'
import PreIssuanceForm from '@/vue/forms/PreIssuanceForm'

import { Sdk } from '@/sdk'
import { ACCOUNT_TYPES, OP_TYPES } from '@tokend/js-sdk'

import { IssuanceRecord } from '@/js/records/operations/issuance.record'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

const PAGE_LIMIT = 200

export default {
  name: 'issuance',
  components: {
    Loader,
    Drawer,
    TopBar,
    EmailGetter,
    IssuanceForm,
    PreIssuanceForm
  },
  data: _ => ({
    issuanceHistory: null,
    isLoaded: false,
    isLoadingFailed: false,
    isIssuanceDrawerShown: false,
    isPreIssuanceDrawerShown: false,
    ACCOUNT_TYPES
  }),
  computed: {
    ...mapGetters([
      vuexTypes.account
    ])
  },
  async created () {
    await this.loadHistory()
    this.isLoaded = true
  },
  methods: {
    async loadHistory () {
      try {
        // FIXME: Add pagination
        const response = await Sdk.horizon.operations.getPage({
          account_id: this[vuexTypes.account].accountId,
          operation_type: OP_TYPES.createIssuanceRequest,
          limit: PAGE_LIMIT
        })
        this.issuanceHistory = response.data
          .map(issuance => new IssuanceRecord(
            issuance, this[vuexTypes.account].accountId)
          )
      } catch (error) {
        this.isLoadingFailed = true
        console.error(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@scss/variables";
@import "~@scss/mixins";

.issuance-history__table {
  overflow-x: auto;
  box-shadow: 0 0.6rem 1rem 0 $col-table-shadow;
  max-width: 105rem;
}

.issuance-btn {
  @include button-raised;
}
</style>
