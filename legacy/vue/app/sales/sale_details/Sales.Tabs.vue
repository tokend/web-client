<template>
  <tabs
    class="app__tabs"
    v-if="isReadyToShowTabs"
    :options="{ useUrlFragment: false }">
    <tab :name="i18n.sale_tabs_market_price()">
      <sale-chart :sale="sale" />
    </tab>
    <tab :name="i18n.sale_tabs_overwiev()">
      <description-tab :description="description" />
    </tab>
    <tab :name="i18n.sale_tabs_details()">
      <sale-tab :sale="sale" />
    </tab>
    <tab :name="i18n.sale_tabs_token()">
      <token-tab :token="token" />
    </tab>
    <tab :name="i18n.sale_tabs_video()" :is-disabled="sale.youTubeVideoId">
      <sale-banner :sale="sale" />
    </tab>
    <tab :name="i18n.sale_tabs_updates()">
      <updates-tab :sale="sale" />
    </tab>
    <tab :name="i18n.sale_tabs_documents()">
      <documents-tab :sale="sale" />
    </tab>
  </tabs>
</template>

<script>
import DescriptionTab from './tabs/Sales.DescriptionTab'
import SaleBanner from './tabs/Sales.BannerTab'
import TokenTab from './tabs/Sales.TokenTab'
import DocumentsTab from './tabs/Sales.DocumentsTab'
import UpdatesTab from './tabs/Sales.UpdatesTab'
import SaleTab from './tabs/Sales.SaleTab'
import SaleChart from './tabs/Sales.ChartTab'
import Tabs from 'L@/vue/app/common/tabs/Tabs'
import Tab from 'L@/vue/app/common/tabs/Tab'
import { i18n } from 'L@/js/i18n'

export default {
  name: 'sale-details-tabs',
  components: {
    DocumentsTab,
    DescriptionTab,
    SaleBanner,
    TokenTab,
    SaleTab,
    UpdatesTab,
    SaleChart,
    Tab,
    Tabs
  },
  props: {
    sale: { type: Object, required: true },
    description: { type: String, default: '' },
    token: { type: Object, default: () => {} }
  },
  data () {
    return {
      i18n
    }
  },
  computed: {
    isReadyToShowTabs () { return !!this.sale.id }
  }
}
</script>

<style lang="scss">
  @import '~L@scss/variables';
  @import '~L@scss/mixins';

  .sales-tabs {
    @include box-shadow;
  }
</style>
