<template>
  <div class="sale-statistics-viewer">
    <tabs>
      <tab
        :name="'sale-whitelist.invite-tab' | globalize"
        id="sale-whitelist-manager-invite-tab"
      >
        <whitelist-invite-form
          :sale="sale"
          @invited="$refs.whitelistInvitationsList.reloadInvitations()"
        />
      </tab>

      <tab
        :name="'sale-whitelist.invitations-list-tab' | globalize"
        id="sale-whitelist-manager-invitations-list-tab"
      >
        <whitelist-invitations-list
          :sale="sale"
          ref="whitelistInvitationsList"
        />
      </tab>
    </tabs>
  </div>
</template>

<script>
import Tabs from '@/vue/common/tabs/Tabs'
import Tab from '@/vue/common/tabs/Tab'

import WhitelistInviteForm from '@/vue/forms/WhitelistInviteForm'
import WhitelistInvitationsList from './whitelist/WhitelistInvitationsList'

import { SaleRecord } from '@/js/records/entities/sale.record'

export default {
  name: 'sale-whitelist-manager',
  components: {
    Tabs,
    Tab,
    WhitelistInviteForm,
    WhitelistInvitationsList,
  },

  props: {
    sale: { type: SaleRecord, required: true },
  },

  data: _ => ({
    shouldInvitesUpdate: false,
  }),
}
</script>
