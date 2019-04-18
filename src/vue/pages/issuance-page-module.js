import { PageModuleDescriptor } from '@/modules-arch/page-module-descriptor'
import { IssuanceExplorerModule } from '@/vue/modules/issuance-explorer/module'
import { IssuanceFormModule } from '@/vue/modules/issuance-form/module'
import { PreIssuanceDrawerPseudoModule } from '@/modules-arch/pseudo-modules/pre-issuance-drawer-pseudo-module'

export class IssuancePageModule extends PageModuleDescriptor {
  constructor (opts = {}) {
    super({
      ...opts,
      importComponentFn: _ => import('@/vue/pages/Issuance'),
      allowedSubmodules: [
        IssuanceExplorerModule,
        IssuanceFormModule,
        PreIssuanceDrawerPseudoModule,
      ],
    })
  }
}
