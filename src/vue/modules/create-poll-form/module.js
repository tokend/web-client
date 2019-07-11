import { ModuleDescriptor } from '@/modules-arch/module-descriptor'

export class CreatePollFormModule extends ModuleDescriptor {
  constructor (opts = {}) {
    super({
      importComponentFn: _ => import('@/vue/modules/create-poll-form'),
      ...opts,
    })
  }
}
