import { PageModuleDescriptor } from '@/modules-arch/page-module-descriptor'
import { PollRequestsModule } from '@/vue/modules/requests/poll-requests/module'

export class PollRequestsPageModule extends PageModuleDescriptor {
  constructor (opts = {}) {
    super({
      ...opts,
      importComponentFn: _ => import('@/vue/pages/polls/PollRequests'),
      allowedSubmodules: [
        PollRequestsModule,
      ],
    })
  }
}
