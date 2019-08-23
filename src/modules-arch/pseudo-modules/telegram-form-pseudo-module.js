import { ModuleDescriptor } from '@/modules-arch/module-descriptor'

export class TelegramFormPseudoModule extends ModuleDescriptor {
  constructor (opts = {}) {
    super({
      importComponentFn: _ => import('@/vue/forms/TelegramForm'),
      ...opts,
    })
  }
}
