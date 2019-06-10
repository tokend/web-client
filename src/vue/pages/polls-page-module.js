import { PageModuleDescriptor } from '@/modules-arch/page-module-descriptor'
import { PollRequestsPageModule } from '@/vue/pages/polls/poll-requests-page'
import { PollsListPageModule } from '@/vue/pages/polls/all-polls-page-module'
import { PollsListOwnedPageModule } from '@/vue/pages/polls/user-owned-polls-page-module'
import { CreatePollFormModule } from '@/vue/modules/create-poll-form/module'

export class PollsPageModule extends PageModuleDescriptor {
  constructor (opts = {}) {
    super({
      ...opts,
      importComponentFn: _ => import('@/vue/pages/Polls'),
      allowedSubmodules: [
        PollRequestsPageModule,
        PollsListPageModule,
        PollsListOwnedPageModule,
        CreatePollFormModule,
      ],
    })
  }
}
