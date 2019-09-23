import { ModuleDescriptor } from '@/modules-arch/module-descriptor'
import { TransferDrawerPseudoModule } from '@/modules-arch/pseudo-modules/transfer-drawer-pseudo-module'

export class MovementsTopBarModule extends ModuleDescriptor {
  constructor (opts = {}) {
    super({
      importComponentFn: _ => import('@/vue/modules/movements-top-bar'),
      allowedSubmodules: [
        TransferDrawerPseudoModule,
      ],
      ...opts,
    })
  }
}
