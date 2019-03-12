import { PageModuleDescriptor } from '@/modules-arch/page-module-descriptor'

export class AssetsPageModule extends PageModuleDescriptor {
  constructor (pageOpts = {}, moduleOpts = {}) {
    super(pageOpts, {
      ...moduleOpts,
      importComponent: _ => import('@/vue/pages/Assets'),
    })
  }
}
