import { PageModuleDescriptor } from '@/modules-arch/page-module-descriptor'
import { IssuanceExplorerModule } from '@/vue/modules/issuance-explorer/module'

export class IssuancePageModule extends PageModuleDescriptor {
  constructor (opts = {}) {
    super({
      ...opts,
      importComponent: _ => import('@/vue/pages/Issuance'),
      allowedSubmodules: [
        IssuanceExplorerModule,
      ],
    })
  }
}
