import { PageModuleDescriptor } from '@/modules-arch/page-module-descriptor'

export class AtomicSwapsExplorePageModule extends PageModuleDescriptor {
  constructor (opts = {}) {
    super({
      ...opts,
      importComponentFn: _ => import('@/vue/pages/atomic-swaps/AtomicSwapsExplore'),
    })
  }
}
