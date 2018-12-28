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
          @click="isCreateDrawerShown = true"
        >
          {{ 'issuance.create-issuance' | globalize }}
        </button>
      </template>
    </top-bar>
    <drawer :is-shown.sync="isPreIssuanceDrawerShown">
      <template slot="heading">
        {{ 'issuance.upload-pre-issuance' | globalize }}
      </template>
      <upload-pre-issuance-form :is-shown.sync="isPreIssuanceDrawerShown" />
    </drawer>
    <drawer :is-shown.sync="isCreateDrawerShown">
      <template slot="heading">
        {{ 'issuance.create-issuance' | globalize }}
      </template>
      <create-issuance-form :is-shown.sync="isCreateDrawerShown" />
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
              <td>
                {{ issuance.counterparty }}
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
        :message-id="'issuance.lbl-loading'"
      />
    </div>
    <div v-else>
      <p>
        {{ 'issuance.lbl-loading-error' | globalize }}
      </p>
    </div>
  </div>
</template>

<script>
import Loader from '@/vue/common/Loader'
import Drawer from '@/vue/common/Drawer'
import TopBar from '@/vue/common/TopBar'
import CreateIssuanceForm from '@/vue/forms/CreateIssuanceForm'
import UploadPreIssuanceForm from '@/vue/forms/UploadPreIssuanceForm'

import { Sdk } from '@/sdk'
// FIXME: move XDR-dependent object imports to sdk
import { ACCOUNT_TYPES, OPERATION_TYPES } from '@/js/const/xdr.const'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

import { errors } from '@tokend/js-sdk'

export default {
  name: 'issuance',
  components: {
    Loader,
    Drawer,
    TopBar,
    CreateIssuanceForm,
    UploadPreIssuanceForm
  },
  data: _ => ({
    issuanceHistory: null,
    isLoaded: false,
    isLoadingFailed: false,
    isCreateDrawerShown: false,
    isPreIssuanceDrawerShown: false,
    ACCOUNT_TYPES
  }),
  computed: {
    ...mapGetters([
      vuexTypes.wallet,
      vuexTypes.account
    ])
  },
  async created () {
    await this.loadIssuanceHistory()
    await this.loadCounterpartyEmails()
    this.isLoaded = true
  },
  methods: {
    async loadIssuanceHistory () {
      try {
        // FIXME: Add pagination
        const response = await Sdk.horizon.operations.getPage({
          account_id: this[vuexTypes.wallet].accountId,
          operation_type: OPERATION_TYPES.createIssuanceRequest,
          limit: 200
        })
        this.issuanceHistory = response.data
      } catch (error) {
        this.isLoadingFailed = true
        console.error(error)
      }
    },
    getCounterpartyId (issuance) {
      const participants = issuance.participants
      return participants[0].accountId === this[vuexTypes.wallet].accountId
        ? participants[1].accountId
        : participants[0].accountId
    },
    async loadCounterpartyEmails () {
      const counterpartyIds = this.issuanceHistory.map(issuance =>
        this.getCounterpartyId(issuance)
      )
      const counterpartyEmails = (await Promise.all(
        counterpartyIds.map(async id =>
          Sdk.api.users.get(id)
            .catch(error => error)
        )
      )).map((response, i) => {
        return response instanceof errors.NotFoundError
          ? counterpartyIds[i]
          : response.data.email
      })
      this.issuanceHistory.map((issuance, i) => {
        issuance.counterparty = counterpartyEmails[i]
      })
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
