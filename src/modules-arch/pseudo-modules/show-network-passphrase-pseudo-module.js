import { ModuleDescriptor } from '@/modules-arch/module-descriptor'

export class ShowNetworkPassphrasePseudoModule extends ModuleDescriptor {
  constructor (opts = {}) {
    super({
      importComponentFn: _ => import('@/vue/fields/ClipboardField'),
      ...opts,
    })
  }
}
