import { PageModuleDescriptor } from '@/modules-arch/page-module-descriptor'
import { SharesTopBarModule } from '@modules/shares-top-bar/module'
import { SharesHistoryModule } from '@/vue/modules/shares-history/module'

export class SharesPageModule extends PageModuleDescriptor {
  constructor (opts = {}) {
    super({
      ...opts,
      importComponentFn: _ => import('@/vue/pages/Shares'),
      allowedSubmodules: [
        SharesHistoryModule,
        SharesTopBarModule,
      ],
    })
  }
}
