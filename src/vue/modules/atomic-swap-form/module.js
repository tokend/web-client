import { ModuleDescriptor } from '@/modules-arch/module-descriptor'

export class AtomicSwapFormModule extends ModuleDescriptor {
  constructor (opts = {}) {
    super({
      importComponentFn: _ => import('@/vue/modules/atomic-swap-form'),
      ...opts,
    })
  }
}
