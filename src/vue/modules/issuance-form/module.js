import { ModuleDescriptor } from '@/modules-arch/module-descriptor'

export class IssuanceFormModule extends ModuleDescriptor {
  constructor (opts = {}) {
    super({
      importComponentFn: _ => import('@/vue/modules/issuance-form'),
      ...opts,
    })
  }
}
