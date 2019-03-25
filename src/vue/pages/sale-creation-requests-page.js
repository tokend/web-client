import { PageModuleDescriptor } from '@/modules-arch/page-module-descriptor'
import { CreateSaleRequestsModule } from '@/vue/modules/requests/create-sale-requests/module'

export class SaleCreationRequestsPageModule extends PageModuleDescriptor {
  constructor (opts = {}) {
    super({
      ...opts,
      importComponentFn: _ => import('@/vue/pages/SaleCreationRequests'),
      allowedSubmodules: [
        CreateSaleRequestsModule,
      ],
    })
  }
}
