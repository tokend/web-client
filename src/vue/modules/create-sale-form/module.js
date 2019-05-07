import { ModuleDescriptor } from '@/modules-arch/module-descriptor'

export class CreateSaleFormModule extends ModuleDescriptor {
  constructor (opts = {}) {
    super({
      importComponentFn: _ => import('@modules/create-sale-form'),
      ...opts,
    })
  }
}
