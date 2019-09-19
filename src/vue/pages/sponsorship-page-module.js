import { PageModuleDescriptor } from '@/modules-arch/page-module-descriptor'
import { BusinessesAllPageModule } from '@/vue/pages/businesses-all-page-module'
import { SponsorshipIncomingRequestsPageModule } from '@/vue/pages/sponsorship-incoming-requests-page-module'
import { SponsorshipOutgoingRequestsPageModule } from '@/vue/pages/sponsorship-outgoing-requests-page-module'

export class SponsorshipPageModule extends PageModuleDescriptor {
  constructor (opts = {}) {
    super({
      ...opts,
      importComponentFn: _ => import('@/vue/pages/Sponsorship'),
      allowedSubmodules: [
        BusinessesAllPageModule,
        SponsorshipIncomingRequestsPageModule,
        SponsorshipOutgoingRequestsPageModule,
      ],
    })
  }
}
