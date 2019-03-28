import { ModuleDescriptor } from '@/modules-arch/module-descriptor'

export class CreateInvoiceFormModule extends ModuleDescriptor {
  constructor (opts = {}) {
    super({
      importComponentFn: _ => import('@modules/loyalty-points/create-invoice-form'),
      importStoreFn: async _ => {
        const { createInvoiceFormModule: res } =
          await import('@modules/loyalty-points/create-invoice-form/store')
        return res
      },
      ...opts,
    })
  }
}
