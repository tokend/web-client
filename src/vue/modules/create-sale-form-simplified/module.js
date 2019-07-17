import { ModuleDescriptor } from '@/modules-arch/module-descriptor'

export class CreateSaleFormModuleSimplified extends ModuleDescriptor {
  constructor (opts = {}) {
    super({
      importComponentFn: _ => import('@modules/create-sale-form-simplified'),
      ...opts,
    })
  }
}
