import { ModuleDescriptor } from '@/modules-arch/module-descriptor'

export class ChangePasswordPseudoModule extends ModuleDescriptor {
  constructor (opts = {}) {
    super({
      importComponentFn: _ => import('@/vue/forms/ChangePasswordForm'),
      ...opts,
    })
  }
}
