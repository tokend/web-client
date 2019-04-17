import { PageModuleDescriptor } from '@/modules-arch/page-module-descriptor'
import { SaleStateWidgetModule } from '@/vue/pages/sale-details/sale-sate-widget-module'

export class SaleCampaignViewerPageModule extends PageModuleDescriptor {
  constructor (opts = {}) {
    super({
      ...opts,
      importComponentFn: _ => import('@/vue/pages/sale-details/SaleCampaignViewer'),
      allowedSubmodules: [
        SaleStateWidgetModule,
      ],
    })
  }
}
