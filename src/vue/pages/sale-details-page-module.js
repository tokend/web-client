import { PageModuleDescriptor } from '@/modules-arch/page-module-descriptor'
import { SaleCampaignViewerPageModule } from '@/vue/pages/sale-details/sale-campaign-viewer-page-module'
import { SimplifySaleCampaignViewerPageModule } from '@/vue/pages/sale-details-simplified/sale-campaign-viewer-page-module'

export class SaleDetailsPageModule extends PageModuleDescriptor {
  constructor (opts = {}) {
    super({
      ...opts,
      importComponentFn: _ => import('@/vue/pages/SaleDetails'),
      allowedSubmodules: [
        SaleCampaignViewerPageModule,
        SimplifySaleCampaignViewerPageModule,
      ],
    })
  }
}
