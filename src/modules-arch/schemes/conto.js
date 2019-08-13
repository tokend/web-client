import { vueRoutes } from '@/vue-router/routes'
import { store } from '@/vuex/index'

import { MovementsHistoryModule } from '@modules/movements-history/module'
import { UserMovementsHistoryModule } from '@modules/user-movements-history/module'
import { MovementsHistoryPageModule } from '@/vue/pages/movements-page-module'
import { CustomersPageModule } from '@/vue/pages/customers-page-module'
import { AssetsPageModule } from '@/vue/pages/assets-page-module'
import { CreateAssetFormSimplifiedModule } from '@modules/create-asset-form-simplified/module'
import { SettingsPageModule } from '@/vue/pages/settings-page-module'
import { VerificationCorporatePageModule } from '@/vue/pages/verification-corporate-page-module'
import { VerificationGeneralPageModule } from '@/vue/pages/verification-general-page-module'
import { VerificationPageModule } from '@/vue/pages/verification-page-module'
import { SecurityPageModule } from '@/vue/pages/security-page-module'
import { ShowAccountIdPseudoModule } from '@/modules-arch/pseudo-modules/show-account-id-pseudo-module'
import { ChangePasswordPseudoModule } from '@/modules-arch/pseudo-modules/change-password-pseudo-module'
import { PhoneNumberFormPseudoModule } from '@/modules-arch/pseudo-modules/phone-number-form-pseudo-module'
import { DefaultQuoteAssetPseudoModule } from '@/modules-arch/pseudo-modules/default-quote-asset-pseudo-module'
import { TransferDrawerPseudoModule } from '@/modules-arch/pseudo-modules/transfer-drawer-pseudo-module'
import { MovementsTopBarModule } from '@modules/movements-top-bar/module'
import { AssetExplorerPageModule } from '@/vue/pages/asset-explorer-page'
import { BalancesPageModule } from '@/vue/pages/balances-page'
import { AssetExplorerModule } from '@/vue/modules/assets/asset-explorer/module'
import { BalanceExplorerModule } from '@/vue/modules/assets/balance-explorer/module'

import { MyAssetsPageModule } from '@/vue/pages/my-assets-page-module'
import { MyAssetsExplorerModule } from '@/vue/modules/assets/my-assets-explorer/module'
import { CustomersListPageModule } from '@/vue/pages/customers-list-page-module'
import { BusinessesPageModule } from '@/vue/pages/businesses-page'
import { BusinessesAllPageModule } from '@/vue/pages/businesses-all-page-module'
import { BusinessesMyPageModule } from '@/vue/pages/businesses-my-page-module'
import { CurrentBusinessIndicatorModule } from '@/vue/navigation/navbar/current-business-indicator/module'
import { BusinessOwnershipModule } from '@/vue/navigation/navbar/business-ownership/module'
import { AtomicSwapsPageModule } from '@/vue/pages/atomic-swaps-page-module'
import { AtomicSwapsExplorePageModule } from '@/vue/pages/atomic-swaps/atomic-swaps-explore-page-module'
import { CreateAtomicSwapFormModule } from '@/vue/modules/create-atomic-swap-form/module'
import { SharesPageModule } from '@/vue/pages/shares-page-module'

export default {
  importLanguageResource (lng) {
    return {
      'en': import('@/modules-arch/schemes/conto-en.json'),
      'ru': import('@/modules-arch/schemes/conto-ru.json'),
    }[lng]
  },
  modules: [
    new CurrentBusinessIndicatorModule({
      isGeneralOnly: true,
    }),
    new BusinessOwnershipModule({
      isCorporateOnly: true,
    }),
  ],
  pages: [
    new CustomersPageModule(
      {
        routerEntry: {
          path: '/customers',
          name: vueRoutes.customers.name,
          meta: { pageNameTranslationId: 'pages-names.customers' },
        },
        menuButtonTranslationId: 'pages-names.customers',
        menuButtonMdiName: 'account',
        isAutoRedirectToFirstChild: true,
        isCorporateOnly: true,
        submodules: [
          new CustomersListPageModule({
            routerEntry: {
              path: '/customers/list',
              name: vueRoutes.customersList.name,
              meta: { pageNameTranslationId: 'pages-names.customers-list' },
            },
            isCorporateOnly: true,
            submodules: [
              new UserMovementsHistoryModule(),
            ],
          }),
        ],
      },
    ),

    new BusinessesPageModule(
      {
        routerEntry: {
          path: '/businesses',
          name: vueRoutes.businesses.name,
          meta: { pageNameTranslationId: 'pages-names.businesses' },
        },
        menuButtonTranslationId: 'pages-names.businesses',
        menuButtonMdiName: 'domain',
        menuSectionTranslationId: 'sidebar.section-explore',
        isAutoRedirectToFirstChild: true,
        isGeneralOnly: true,
        submodules: [
          new BusinessesAllPageModule({
            routerEntry: {
              path: '/businesses/all',
              name: vueRoutes.allBusinesses.name,
              props: true,
            },
            isGeneralOnly: true,
          }),
          new BusinessesMyPageModule({
            routerEntry: {
              path: '/businesses/my',
              name: vueRoutes.myBusinesses.name,
              props: true,
            },
            isGeneralOnly: true,
          }),
        ],
      },
    ),

    new MovementsHistoryPageModule(
      {
        routerEntry: {
          path: '/movements',
          name: vueRoutes.movements.name,
          meta: { pageNameTranslationId: 'pages-names.movements' },
        },
        menuButtonTranslationId: 'pages-names.movements',
        menuButtonMdiName: 'menu',
        isGeneralOnly: true,
        isWithBusinessToBrowseOnly: true,
        submodules: [
          new MovementsHistoryModule(),
          new MovementsTopBarModule({
            submodules: [
              new TransferDrawerPseudoModule(),
            ],
          }),
        ],
      },
    ),

    new SharesPageModule(
      {
        routerEntry: {
          path: '/register-of-shares',
          name: vueRoutes.registerOfShares.name,
          meta: { pageNameTranslationId: 'pages-names.register-of-shares' },
        },
        menuButtonTranslationId: 'pages-names.register-of-shares',
        menuButtonMdiName: 'book-open',
        submodules: [
          new MovementsTopBarModule(),
          new MovementsHistoryModule(),
        ],
        isCorporateOnly: true,
      },
    ),

    new AssetsPageModule(
      {
        routerEntry: {
          path: '/assets',
          name: vueRoutes.assets.name,
        },
        menuButtonTranslationId: 'pages-names.assets',
        menuButtonMdiName: 'coins',
        isAutoRedirectToFirstChild: true,
        isWithBusinessToBrowseOnly: true,
        submodules: [
          new AssetExplorerPageModule({
            routerEntry: {
              path: '/assets/explore',
              name: vueRoutes.assetsExplore.name,
              meta: { pageNameTranslationId: 'pages-names.assets' },
            },
            submodules: [
              new AssetExplorerModule(),
            ],
            isGeneralOnly: true,
          }),
          new BalancesPageModule({
            routerEntry: {
              path: '/assets/balances',
              name: vueRoutes.balances.name,
              meta: { pageNameTranslationId: 'pages-names.assets' },
            },
            submodules: [
              new BalanceExplorerModule(),
            ],
            isGeneralOnly: true,
          }),
          new MyAssetsPageModule({
            routerEntry: {
              path: '/assets/my-assets',
              name: vueRoutes.myAssets.name,
              meta: { pageNameTranslationId: 'pages-names.assets' },
            },
            submodules: [
              new MyAssetsExplorerModule(),
            ],
            isCorporateOnly: true,
          }),
          new CreateAssetFormSimplifiedModule({
            isCorporateOnly: true,
          }),
        ],
      },
    ),

    // HINT: temp. disabled
    // new SalesPageModule(
    //   {
    //     routerEntry: {
    //       path: '/sales',
    //       name: vueRoutes.sales.name,
    //       meta: { pageNameTranslationId: 'pages-names.sales' },
    //     },
    //     menuButtonTranslationId: 'pages-names.sales',
    //     menuButtonMdiName: 'trending-up',
    //     isAutoRedirectToFirstChild: true,
    //     submodules: [
    //       new SalesListPageModule({
    //         routerEntry: {
    //           path: '/sales/all',
    //           name: vueRoutes.investableSales.name,
    //           props: {
    //             default: true,
    //             isUserSales: false,
    //           },
    //         },
    //         isGeneralOnly: true,
    //       }),
    //       new SalesListOwnedPageModule({
    //         routerEntry: {
    //           path: '/sales/my',
    //           name: vueRoutes.userOwnedSales.name,
    //           props: {
    //             default: true,
    //             isUserSales: true,
    //           },
    //         },
    //         isCorporateOnly: true,
    //       }),
    //       new CreateSaleFormModuleSimplified({
    //         isCorporateOnly: true,
    //       }),
    //     ],
    //   },
    // ),

    // new SaleDetailsPageModule(
    //   {
    //     routerEntry: {
    //       path: '/sales/:id',
    //       name: vueRoutes.saleDetails.name,
    //       meta: { pageNameTranslationId: 'pages-names.sale-details' },
    //       redirect: to => ({ ...vueRoutes.saleCampaign, params: to.params }),
    //       props: true,
    //     },
    //     submodules: [
    //       new SimplifySaleCampaignViewerPageModule({
    //         routerEntry: {
    //           path: '/sales/:id/campaign',
    //           name: vueRoutes.saleCampaign.name,
    //           props: true,
    //         },
    //         submodules: [
    //           new SimplifySaleStateWidgetModule(),
    //         ],
    //       }),
    //     ],
    //   },
    // ),

    // new PollsPageModule(
    //   {
    //     routerEntry: {
    //       path: '/polls',
    //       name: vueRoutes.polls.name,
    //       meta: { pageNameTranslationId: 'pages-names.polls' },
    //     },
    //     menuButtonTranslationId: 'pages-names.polls',
    //     menuButtonMdiName: 'vote',
    //     isAutoRedirectToFirstChild: true,
    //     submodules: [
    //       new PollsAllPageModule({
    //         routerEntry: {
    //           path: '/polls/all',
    //           name: vueRoutes.allPolls.name,
    //           props: true,
    //         },
    //       }),
    //       new CreatePollFormModule({
    //         isCorporateOnly: true,
    //       }),
    //     ],
    //   },
    // ),

    new AtomicSwapsPageModule(
      {
        routerEntry: {
          path: '/atomic-swaps',
          name: vueRoutes.atomicSwaps.name,
          meta: { pageNameTranslationId: 'pages-names.atomic-swaps' },
        },
        menuButtonTranslationId: 'pages-names.atomic-swaps',
        menuButtonMdiName: 'swap-horizontal',
        isAutoRedirectToFirstChild: true,
        isCorporateOnly: true,
        submodules: [
          new AtomicSwapsExplorePageModule({
            routerEntry: {
              path: '/atomic-swaps/explore',
              name: vueRoutes.atomicSwapsExplore.name,
              props: true,
              beforeEnter: async (to, from, next) => {
                if (to.query.owner !== store.getters.accountId) {
                  to.query.owner = store.getters.accountId
                  next(to)
                } else {
                  next()
                }
              },
            },
            isCorporateOnly: true,
          }),
          new CreateAtomicSwapFormModule({
            isCorporateOnly: true,
          }),
        ],
      },
    ),

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
          new VerificationPageModule({
            routerEntry: {
              path: '/settings/verification',
              name: vueRoutes.verification.name,
            },
            submodules: [
              new VerificationCorporatePageModule({
                routerEntry: {
                  path: '/settings/verification/corporate',
                  name: vueRoutes.verificationCorporate.name,
                },
              }),
              new VerificationGeneralPageModule({
                routerEntry: {
                  path: '/settings/verification/general',
                  name: vueRoutes.verificationGeneral.name,
                },
              }),
            ],
          }),

          new SecurityPageModule({
            routerEntry: {
              path: '/settings/security',
              name: vueRoutes.security.name,
            },
            submodules: [
              new ChangePasswordPseudoModule(),
              new ShowAccountIdPseudoModule({
                isCorporateOnly: true,
              }),
              new PhoneNumberFormPseudoModule(),
              new DefaultQuoteAssetPseudoModule({
                isCorporateOnly: true,
              }),
            ],
          }),
        ],
      }
    ),
  ],
}
