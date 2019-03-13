import { PageModuleDescriptor } from '@/modules-arch/page-module-descriptor'
import { AssetCreationRequestsPageModule } from './asset-creation-requests-page'
import { SaleCreationRequestsPageModule } from './sale-creation-requests-page'
import { PreIssuanceRequestsPageModule } from './pre-issuance-requests-page'

export class RequestsPageModule extends PageModuleDescriptor {
  constructor (opts = {}) {
    super({
      ...opts,
      importComponentFn: _ => import('@/vue/pages/Requests'),
      allowedSubmodules: [
        AssetCreationRequestsPageModule,
        SaleCreationRequestsPageModule,
        PreIssuanceRequestsPageModule,
      ],
    })
  }
}
