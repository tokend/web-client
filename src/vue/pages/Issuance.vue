<template>
  <div>
    <router-link
      v-ripple
      :to="{ name: 'app.issuance' }"
    >
      <span>History</span>
    </router-link>
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
    <drawer :is-shown.sync="isPreIssuanceDrawerShown">
      <template slot="heading">
        {{ 'issuance.upload-pre-issuance' | globalize }}
      </template>
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
import CreateIssuanceForm from '@/vue/forms/CreateIssuanceForm'

import { Sdk } from '@/sdk'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

import { errors } from '@tokend/js-sdk'

export default {
  name: 'issuance',
  components: {
    Loader,
    Drawer,
    CreateIssuanceForm
  },
  data: _ => ({
    issuanceHistory: null,
    isLoaded: false,
    isLoadingFailed: false,
    isCreateDrawerShown: false,
    isPreIssuanceDrawerShown: false
  }),
  computed: {
    ...mapGetters('new-wallet', [
      vuexTypes.wallet
    ])
  },
  async created () {
    await this.loadIssuanceHistory()
  },
  methods: {
    async loadIssuanceHistory () {
      try {
        const response = await Sdk.horizon.operations.getPage({
          account_id: this[vuexTypes.wallet].accountId,
          operation_type: 3,
          limit: 200
        })
        this.issuanceHistory = response.data
        await this.loadCounterpartyEmails()
        this.isLoaded = true
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
  box-shadow: 0 0.6 * $point $point 0 $col-table-shadow;
  max-width: 105 * $point;
}

.issuance-btn {
  @include button-raised;
}
</style>
