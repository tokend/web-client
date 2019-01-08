<template>
  <div>
    <top-bar>
      <template slot="main">
        <router-link
          v-ripple
          :to="{ name: 'app.issuance' }"
        >
          <span>{{ 'issuance.history' | globalize }}</span>
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
          {{ 'issuance.upload-pre-issuance' | globalize }}
        </button>
        <button
          v-ripple
          class="issuance-btn"
          @click="isIssuanceDrawerShown = true"
        >
          {{ 'issuance.create-issuance' | globalize }}
        </button>
      </template>
    </top-bar>
    <drawer :is-shown.sync="isPreIssuanceDrawerShown">
      <template slot="heading">
        {{ 'issuance.upload-pre-issuance' | globalize }}
      </template>
      <pre-issuance-form @cancel="isPreIssuanceDrawerShown = false" />
    </drawer>
    <drawer :is-shown.sync="isIssuanceDrawerShown">
      <template slot="heading">
        {{ 'issuance.create-issuance' | globalize }}
      </template>
      <issuance-form @cancel="isIssuanceDrawerShown = false" />
    </drawer>
    <div class="issuance" v-if="isLoaded">
      <div class="issuance-history__table">
        <table class="app__table">
          <thead>
            <tr>
              <th>
                {{ 'issuance.counterparty' | globalize }}
              </th>
              <th>
                {{ 'issuance.amount' | globalize }}
              </th>
              <th>
                {{ 'issuance.asset-code' | globalize }}
              </th>
              <th>
                {{ 'issuance.date' | globalize }}
              </th>
              <th>
                {{ 'issuance.reference' | globalize }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="issuance in issuanceHistory" :key="issuance.id">
              <td v-if="issuance.counterparty">
                {{ issuance.counterparty }}
              </td>
              <td v-else>
                <loader
                  :message-id="'issuance.loading-lbl'"
                />
              </td>
              <td>
                {{
                  issuance.amount | formatMoney
                }}
              </td>
              <td>
                {{
                  issuance.asset
                }}
              </td>
              <td>
                {{ issuance.ledgerCloseTime | formatCalendar }}
              </td>
              <td>
                {{ issuance.reference }}
              </td>
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
import IssuanceForm from '@/vue/forms/IssuanceForm'
import PreIssuanceForm from '@/vue/forms/PreIssuanceForm'

import { Sdk } from '@/sdk'
// FIXME: move XDR-dependent object imports to sdk
import { ACCOUNT_TYPES, OPERATION_TYPES } from '@/js/const/xdr.const'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

import { errors } from '@tokend/js-sdk'

const PAGE_LIMIT = 200

export default {
  name: 'issuance',
  components: {
    Loader,
    Drawer,
    TopBar,
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
    await this.loadCounterpartyEmails()
  },
  methods: {
    async loadHistory () {
      try {
        // FIXME: Add pagination
        const response = await Sdk.horizon.operations.getPage({
          account_id: this[vuexTypes.account].id,
          operation_type: OPERATION_TYPES.createIssuanceRequest,
          limit: PAGE_LIMIT
        })
        this.issuanceHistory = response.data
      } catch (error) {
        this.isLoadingFailed = true
        console.error(error)
      }
    },
    getCounterpartyId (issuance) {
      const participants = issuance.participants
      return participants[0].accountId === this[vuexTypes.account].id
        ? participants[1].accountId
        : participants[0].accountId
    },
    async loadCounterpartyEmails () {
      for (let issuance of this.issuanceHistory) {
        const counterpartyId = this.getCounterpartyId(issuance)
        const response = await Sdk.api.users.get(counterpartyId)
          .catch(error => error)
        const counterparty = response instanceof errors.NotFoundError
          ? counterpartyId
          : response.data.email
        this.$set(issuance, 'counterparty', counterparty)
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
