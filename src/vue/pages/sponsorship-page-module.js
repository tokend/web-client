import { PageModuleDescriptor } from '@/modules-arch/page-module-descriptor'
import { BusinessesAllPageModule } from '@/vue/pages/businesses-all-page-module'

export class SponsorshipPageModule extends PageModuleDescriptor {
  constructor (opts = {}) {
    super({
      ...opts,
      importComponentFn: _ => import('@/vue/pages/Sponsorship'),
      allowedSubmodules: [
        BusinessesAllPageModule,
      ],
    })
  }
}
