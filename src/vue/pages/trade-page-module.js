import { PageModuleDescriptor } from '@/modules-arch/page-module-descriptor'

export class TradePageModule extends PageModuleDescriptor {
  constructor (pageOpts = {}, moduleOpts = {}) {
    super(pageOpts, {
      ...moduleOpts,
      importComponent: _ => import('@/vue/pages/Trade'),
    })
  }
}
