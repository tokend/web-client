import { PageModuleDescriptor } from '@/modules-arch/page-module-descriptor'
import { FeesModule } from '@/vue/modules/fees/module'

export class FeesPageModule extends PageModuleDescriptor {
  constructor (opts = {}) {
    super({
      ...opts,
      importComponent: _ => import('@/vue/pages/Fees'),
      allowedSubmodules: [
        FeesModule,
      ],
    })
  }
}
