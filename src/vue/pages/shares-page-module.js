import { PageModuleDescriptor } from '@/modules-arch/page-module-descriptor'
import { MovementsTopBarModule } from '@modules/movements-top-bar/module'
import { MovementsHistoryModule } from '@/vue/modules/movements-history/module'

export class SharesPageModule extends PageModuleDescriptor {
  constructor (opts = {}) {
    super({
      ...opts,
      importComponentFn: _ => import('@/vue/pages/Shares'),
      allowedSubmodules: [
        MovementsTopBarModule,
        MovementsHistoryModule,
      ],
    })
  }
}
