import { ModuleDescriptor } from '@/modules-arch/module-descriptor'

export class CreateAtomicSwapFormModule extends ModuleDescriptor {
  constructor (opts = {}) {
    super({
      importComponentFn: _ => import('@/vue/modules/create-atomic-swap-form'),
      ...opts,
    })
  }
}
