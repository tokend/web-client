<template>
  <div class="issuance" v-if="isLoaded">
    <div class="issuance-history__table">
      <table class="app__table">
        <thead>
          <tr>
            <th>
              {{ 'issuance-table.counterparty' | globalize }}
            </th>
            <th>
              {{ 'issuance-table.amount' | globalize }}
            </th>
            <th>
              {{ 'issuance-table.asset-code' | globalize }}
            </th>
            <th>
              {{ 'issuance-table.date' | globalize }}
            </th>
            <th>
              {{ 'issuance-table.reference' | globalize }}
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
              {{ issuance.ledgerCloseTime | formatDate }}
            </td>
            <td>
              {{ issuance.reference }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div v-else-if="!isFailed">
    <loader
      :message-id="'issuance-table.lbl-loading'"
    />
  </div>
  <div v-else>
    <p>
      {{ 'issuance-table.lbl-loading-error' | globalize }}
    </p>
  </div>
</template>

<script>
import Loader from '../common/Loader'

import { Sdk } from '@/sdk'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

export default {
  name: 'issuance',
  components: {
    Loader
  },
  data: _ => ({
    issuanceHistory: null,
    isLoaded: false,
    isFailed: false
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
        this.isFailed = true
        console.error(error)
      }
    },
    getCounterparty (issuance) {
      const participants = issuance.participants
      return participants[0].accountId === this[vuexTypes.wallet].accountId
        ? participants[1].accountId
        : participants[0].accountId
    },
    async loadCounterpartyEmails () {
      const counterpartyIds = this.issuanceHistory.map(issuance =>
        this.getCounterparty(issuance)
      )
      const counterpartyEmails = (await Promise.all(
        counterpartyIds.map(async id =>
          Sdk.api.users.get(id)
            .catch(error => error)
        )
      )).map((response, i) => {
        return response instanceof Error
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
@import "@/scss/variables";

.issuance-history__table {
  overflow-x: auto;
  box-shadow: 0 0.6 * $point $point 0 $col-table-shadow;
}
</style>
