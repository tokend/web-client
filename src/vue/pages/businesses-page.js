import { PageModuleDescriptor } from '@/modules-arch/page-module-descriptor'
import { BusinessesAllPageModule } from '@/vue/pages/businesses-all-page-module'
import { BusinessesMyPageModule } from '@/vue/pages/businesses-my-page-module'

export class BusinessesPageModule extends PageModuleDescriptor {
  constructor (opts = {}) {
    super({
      ...opts,
      importComponentFn: _ => import('@/vue/pages/Businesses'),
      allowedSubmodules: [
        BusinessesAllPageModule,
        BusinessesMyPageModule,
      ],
    })
  }
}
