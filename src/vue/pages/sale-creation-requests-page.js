import { PageModuleDescriptor } from '@/modules-arch/page-module-descriptor'
import { SaleCreationRequestsModule } from '@/vue/modules/requests/sale-creation-requests/module'

export class SaleCreationRequestsPageModule extends PageModuleDescriptor {
  constructor (opts = {}) {
    super({
      ...opts,
      importComponentFn: _ => import('@/vue/pages/SaleCreationRequests'),
      allowedSubmodules: [
        SaleCreationRequestsModule,
      ],
    })
  }
}
