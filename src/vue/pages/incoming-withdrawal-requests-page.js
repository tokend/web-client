import { PageModuleDescriptor } from '@/modules-arch/page-module-descriptor'
import { IncomingWithdrawalRequestsModule } from '@/vue/modules/requests/incoming-withdrawal-requests/module'

export class IncomingWithdrawalRequestsPageModule extends PageModuleDescriptor {
  constructor (opts = {}) {
    super({
      ...opts,
      importComponentFn: _ => import('@/vue/pages/IncomingWithdrawalRequests'),
      allowedSubmodules: [
        IncomingWithdrawalRequestsModule,
      ],
    })
  }
}
