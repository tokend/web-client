import { PageModuleDescriptor } from '@/modules-arch/page-module-descriptor'
import { SimplifySaleStateWidgetModule } from '@/vue/pages/sale-details-simplified/sale-sate-widget-module'

export class SimplifySaleCampaignViewerPageModule extends PageModuleDescriptor {
  constructor (opts = {}) {
    super({
      ...opts,
      importComponentFn: _ => import('@/vue/pages/sale-details-simplified/SaleCampaignViewer'),
      allowedSubmodules: [
        SimplifySaleStateWidgetModule,
      ],
    })
  }
}
