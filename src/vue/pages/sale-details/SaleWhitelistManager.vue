<template>
  <div class="sale-statistics-viewer">
    <tabs>
      <tab
        :name="'sale-whitelist.invite-tab' | globalize"
        id="sale-whitelist-manager-invite-tab"
      >
        Invite tab
      </tab>

      <tab
        :name="'sale-whitelist.unregistered-users-tab' | globalize"
        id="sale-whitelist-manager-unregistered-users-tab"
      >
        Unregistered users
      </tab>

      <tab
        :name="'sale-whitelist.registered-users-tab' | globalize"
        id="sale-whitelist-manager-registered-users-tab"
      >
        <sale-whitelist-registered-users :sale="sale" />
      </tab>
    </tabs>
  </div>
</template>

<script>
import Tabs from '@/vue/common/tabs/Tabs'
import Tab from '@/vue/common/tabs/Tab'
import SaleWhitelistRegisteredUsers from './whitelist/SaleWhitelistRegisteredUsers'

import { SaleRecord } from '@/js/records/entities/sale.record'

export default {
  name: 'sale-whitelist-manager',
  components: {
    Tabs,
    Tab,
    SaleWhitelistRegisteredUsers,
  },

  props: {
    sale: { type: SaleRecord, required: true },
  },
}
</script>
