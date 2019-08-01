import { ModuleDescriptor } from '@/modules-arch/module-descriptor'

export class PhoneNumberFormPseudoModule extends ModuleDescriptor {
  constructor (opts = {}) {
    super({
      importComponentFn: _ => import('@/vue/forms/PhoneNumberForm'),
      ...opts,
    })
  }
}
