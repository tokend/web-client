import { PageModule } from '@/modules-arch/page-module'

export class SettingsPageModule extends PageModule {
  constructor (pageOpts = {}, moduleOpts = {}) {
    super(pageOpts, {
      ...moduleOpts,
      importComponent: _ => import('@/vue/pages/Settings'),
    })
  }
}
