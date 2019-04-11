import { PageModuleDescriptor } from '@/modules-arch/page-module-descriptor'
import { PreIssuanceRequestsModule } from '@/vue/modules/requests/pre-issuance-requests/module'

export class PreIssuanceRequestsPageModule extends PageModuleDescriptor {
  constructor (opts = {}) {
    super({
      ...opts,
      importComponentFn: _ => import('@/vue/pages/PreIssuanceRequests'),
      allowedSubmodules: [
        PreIssuanceRequestsModule,
      ],
    })
  }
}
