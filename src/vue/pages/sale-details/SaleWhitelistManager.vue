<template>
  <div class="sale-statistics-viewer">
    <tabs>
      <tab
        :name="'sale-whitelist.invite-tab' | globalize"
        id="sale-whitelist-manager-invite-tab"
      >
        <whitelist-invite-form :sale="sale" />
      </tab>

      <tab
        :name="'sale-whitelist.unregistered-users-tab' | globalize"
        id="sale-whitelist-manager-unregistered-users-tab"
      >
        <sale-whitelist-unregistered-users :sale="sale" />
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

import WhitelistInviteForm from '@/vue/forms/WhitelistInviteForm'
import SaleWhitelistRegisteredUsers from './whitelist/SaleWhitelistRegisteredUsers'
import SaleWhitelistUnregisteredUsers from './whitelist/SaleWhitelistUnregisteredUsers'

import { SaleRecord } from '@/js/records/entities/sale.record'

export default {
  name: 'sale-whitelist-manager',
  components: {
    Tabs,
    Tab,
    WhitelistInviteForm,
    SaleWhitelistRegisteredUsers,
    SaleWhitelistUnregisteredUsers,
  },

  props: {
    sale: { type: SaleRecord, required: true },
  },
}
</script>
