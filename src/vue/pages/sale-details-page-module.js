import { PageModule } from '@/modules-arch/page-module'

export class SaleDetailsPageModule extends PageModule {
  constructor (pageOpts = {}, moduleOpts = {}) {
    super(pageOpts, {
      ...moduleOpts,
      importComponent: _ => import('@/vue/pages/SaleDetails'),
    })
  }
}
