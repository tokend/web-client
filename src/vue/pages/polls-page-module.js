import { PageModuleDescriptor } from '@/modules-arch/page-module-descriptor'
import { PollRequestsPageModule } from '@/vue/pages/polls/poll-requests-page'
import { PollsAllPageModule } from '@/vue/pages/polls-all-page-module'
import { PollsListOwnedPageModule } from '@/vue/pages/polls/user-owned-polls-page-module'
import { CreatePollFormModule } from '@/vue/modules/create-poll-form/module'

export class PollsPageModule extends PageModuleDescriptor {
  constructor (opts = {}) {
    super({
      ...opts,
      importComponentFn: _ => import('@/vue/pages/Polls'),
      allowedSubmodules: [
        PollRequestsPageModule,
        PollsAllPageModule,
        PollsListOwnedPageModule,
        CreatePollFormModule,
      ],
    })
  }
}
