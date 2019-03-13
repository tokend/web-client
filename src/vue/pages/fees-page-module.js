import { PageModuleDescriptor } from '@/modules-arch/page-module-descriptor'
import { FeesModule } from '@/vue/modules/fees/module'

export class FeesPageModule extends PageModuleDescriptor {
  constructor (opts = {}) {
    super({
      ...opts,
      importComponentFn: _ => import('@/vue/pages/Fees'),
      allowedSubmodules: [
        FeesModule,
      ],
    })
  }
}
