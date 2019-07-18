import { vueRoutes } from '@/vue-router/routes'

import { SettingsPageModule } from '@/vue/pages/settings-page-module'
import { DocumentsPageModule } from '@/vue/pages/documents-page-module'
import { SecurityPageModule } from '@/vue/pages/security-page-module'
import { ShowAccountIdPseudoModule } from '@/modules-arch/pseudo-modules/show-account-id-pseudo-module'
import { ShowSeedPseudoModule } from '@/modules-arch/pseudo-modules/show-seed-pseudo-module'
import { DocumentExplorerPageModule } from '@/vue/pages/document-explorer-page-module'
import { DocumentManagerPageModule } from '@/vue/pages/document-manager-page-module'

export default {
  importLanguageResource (lng) {
    return {
      'en': import('@/modules-arch/schemes/healthcare.en.json'),
      'ru': import('@/modules-arch/schemes/healthcare.ru.json'),
    }[lng]
  },
  pages: [
    new DocumentsPageModule({
      routerEntry: {
        path: '/documents',
        name: vueRoutes.documents.name,
      },
      menuButtonTranslationId: 'pages-names.documents',
      menuButtonMdiName: 'file-document-box',
      isAutoRedirectToFirstChild: true,
      submodules: [
        new DocumentExplorerPageModule({
          routerEntry: {
            path: '/documents/explore',
            name: vueRoutes.documentExplorer.name,
          },
        }),
        new DocumentManagerPageModule({
          routerEntry: {
            path: '/documents/:id',
            name: vueRoutes.documentManager.name,
            props: true,
          },
        }),
      ],
    }),

    new SettingsPageModule(
      {
        routerEntry: {
          path: '/settings',
          name: vueRoutes.settings.name,
          meta: { pageNameTranslationId: 'pages-names.settings' },
        },
        menuButtonTranslationId: 'pages-names.settings',
        menuButtonMdiName: 'account-settings',
        menuSectionTranslationId: 'sidebar.section-account',
        isAutoRedirectToFirstChild: true,
        submodules: [
          new SecurityPageModule({
            routerEntry: {
              path: '/settings/security',
              name: vueRoutes.security.name,
            },
            submodules: [
              new ShowAccountIdPseudoModule(),
              new ShowSeedPseudoModule(),
            ],
          }),
        ],
      }
    ),
  ],
}
