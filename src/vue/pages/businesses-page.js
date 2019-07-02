import { PageModuleDescriptor } from '@/modules-arch/page-module-descriptor'
import { BusinessesAllPageModule } from '@/vue/pages/businesses-all-page-module'

export class BusinessesPageModule extends PageModuleDescriptor {
  constructor (opts = {}) {
    super({
      ...opts,
      importComponentFn: _ => import('@/vue/pages/Businesses'),
      allowedSubmodules: [
        BusinessesAllPageModule,
      ],
    })
  }
}
