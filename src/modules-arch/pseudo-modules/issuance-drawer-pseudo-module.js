import { ModuleDescriptor } from '@/modules-arch/module-descriptor'

export class IssuanceDrawerPseudoModule extends ModuleDescriptor {
  constructor (opts = {}) {
    super({
      importComponentFn: _ => import('@/vue/forms/IssuanceForm'),
      ...opts,
    })
  }
}
