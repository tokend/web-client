<template>
  <div class="sale-statistics-viewer">
    <tabs>
      <tab
        :name="'sale-whitelist.invite-tab' | globalize"
        id="sale-whitelist-manager-invite-tab"
      >
        <whitelist-invite-form
          :sale="sale"
          @invited="shouldInvitesUpdate = true"
        />
      </tab>

      <tab
        :name="'sale-whitelist.invites-list-tab' | globalize"
        id="sale-whitelist-manager-invites-list-tab"
      >
        <whitelist-invites
          :sale="sale"
          :should-update.sync="shouldInvitesUpdate"
        />
      </tab>
    </tabs>
  </div>
</template>

<script>
import Tabs from '@/vue/common/tabs/Tabs'
import Tab from '@/vue/common/tabs/Tab'

import WhitelistInviteForm from '@/vue/forms/WhitelistInviteForm'
import WhitelistInvites from './whitelist/WhitelistInvites'

import { SaleRecord } from '@/js/records/entities/sale.record'

export default {
  name: 'sale-whitelist-manager',
  components: {
    Tabs,
    Tab,
    WhitelistInviteForm,
    WhitelistInvites,
  },

  props: {
    sale: { type: SaleRecord, required: true },
  },

  data: _ => ({
    shouldInvitesUpdate: false,
  }),
}
</script>
