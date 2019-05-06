import { ModuleDescriptor } from '@/modules-arch/module-descriptor'

export class PreIssuanceFormModule extends ModuleDescriptor {
  constructor (opts = {}) {
    super({
      importComponentFn: _ => import('@modules/pre-issuance-form'),
      ...opts,
    })
  }
}
