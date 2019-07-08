import { ModuleDescriptor } from '@/modules-arch/module-descriptor'

export class CurrentBusinessIndicatorModule extends ModuleDescriptor {
  constructor (opts = {}) {
    super({
      importComponentFn: _ => import('@/vue/navigation/navbar/current-business-indicator/index.vue'),
      ...opts,
    })
  }
}
