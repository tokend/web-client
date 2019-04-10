import { PageModuleDescriptor } from '@/modules-arch/page-module-descriptor'
import { DividendFormModule } from '@/vue/modules/dividend-form/module'
import { BuyBackFormModule } from '@/vue/modules/buy-back-form/module'
import { SaleCampaignViewerPageModule } from '@/vue/pages/sale-details/sale-campaign-viewer-page-module'
import { SaleStateWidgetModule } from '@/vue/pages/sale-details/sale-sate-widget-module'

export class OpportunityDetailsPageModule extends PageModuleDescriptor {
  constructor (opts = {}) {
    super({
      ...opts,
      importComponentFn: _ => import('@/vue/pages/OpportunityDetails'),
      allowedSubmodules: [
        DividendFormModule,
        BuyBackFormModule,
        SaleCampaignViewerPageModule,
        SaleStateWidgetModule,
      ],
    })
  }
}
