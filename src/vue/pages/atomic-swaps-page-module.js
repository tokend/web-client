import { PageModuleDescriptor } from '@/modules-arch/page-module-descriptor'
import { CreateAtomicSwapFormModule } from '@/vue/modules/create-atomic-swap-form/module'
import { AtomicSwapsExplorePageModule } from '@/vue/pages/atomic-swaps/atomic-swaps-explore-page-module'

export class AtomicSwapsPageModule extends PageModuleDescriptor {
  constructor (opts = {}) {
    super({
      ...opts,
      importComponentFn: _ => import('@/vue/pages/AtomicSwaps'),
      allowedSubmodules: [
        AtomicSwapsExplorePageModule,
        CreateAtomicSwapFormModule,
      ],
    })
  }
}
