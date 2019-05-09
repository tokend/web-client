<template>
  <div class="sale-statistics-viewer">
    <tabs>
      <tab
        :name="'sale-whitelist-manager.invite-tab' | globalize"
        id="sale-whitelist-manager-invite-tab"
      >
        Invite tab
      </tab>

      <tab
        :name="'sale-whitelist-manager.unregistered-users-tab' | globalize"
        id="sale-whitelist-manager-unregistered-users-tab"
      >
        Unregistered users
      </tab>

      <tab
        :name="'sale-whitelist-manager.registered-users-tab' | globalize"
        id="sale-whitelist-manager-registered-users-tab"
      >
        Registered users
      </tab>
    </tabs>
  </div>
</template>

<script>
import Tabs from '@/vue/common/tabs/Tabs'
import Tab from '@/vue/common/tabs/Tab'

import { SaleRecord } from '@/js/records/entities/sale.record'

export default {
  name: 'sale-whitelist-manager',
  components: {
    Tabs,
    Tab,
  },

  props: {
    sale: { type: SaleRecord, required: true },
  },
}
</script>
