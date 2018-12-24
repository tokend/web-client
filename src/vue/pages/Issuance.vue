<template>
  <div class="issuance" v-if="issuanceHistory">
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
              {{ issuance.details.issuanceCreate.receiver }}
            </td>
            <td>
              {{
                issuance.details.issuanceCreate.amount | formatMoney
              }}
            </td>
            <td>
              {{
                issuance.details.issuanceCreate.asset
              }}
            </td>
            <td>
              {{ issuance.createdAt | formatDate }}
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
      :message-id="'issaunce-table.lbl-loading'"
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
        const response = await Sdk.horizon.request.getAllForIssuances({
          requestor: this[vuexTypes.wallet].accountId
        })
        this.issuanceHistory = response.data
      } catch (error) {
        this.isFailed = true
        console.error(error)
      }
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
