import { PageModuleDescriptor } from '@/modules-arch/page-module-descriptor'
import { AtomicSwapFormModule } from '@modules/atomic-swap-form/module'

export class AtomicSwapsExplorePageModule extends PageModuleDescriptor {
  constructor (opts = {}) {
    super({
      ...opts,
      importComponentFn: _ => import('@/vue/pages/atomic-swaps/AtomicSwapsExplore'),
      allowedSubmodules: [
        AtomicSwapFormModule,
      ],
    })
  }
}
