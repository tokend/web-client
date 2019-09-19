import { PageModuleDescriptor } from '@/modules-arch/page-module-descriptor'
import { SponsorshipRequestsModule } from '@/vue/modules/requests/sponsorship-requests/module'

// eslint-disable-next-line max-len
export class SponsorshipOutgoingRequestsPageModule extends PageModuleDescriptor {
  constructor (opts = {}) {
    super({
      ...opts,
      importComponentFn: _ => import('@/vue/pages/SponsorshipOutgoingRequestsPage'),
      allowedSubmodules: [
        SponsorshipRequestsModule,
      ],
    })
  }
}
