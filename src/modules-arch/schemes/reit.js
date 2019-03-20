import { vueRoutes } from '@/vue-router/routes'

import { MovementsHistoryModule } from '@/vue/modules/movements-history/module'
import { MovementsHistoryPageModule } from '@/vue/pages/movements-page-module'
import { DashboardPageModule } from '@/vue/pages/dashboard-page-module'
import { FeesPageModule } from '@/vue/pages/fees-page-module'
import { FeesModule } from '@/vue/modules/fees/module'
import { IssuancePageModule } from '@/vue/pages/issuance-page-module'
import { IssuanceExplorerModule } from '@/vue/modules/issuance-explorer/module'
import { TradePageModule } from '@/vue/pages/trade-page-module'
import { LimitsPageModule } from '@/vue/pages/limits-page-module'
import { SalesPageModule } from '@/vue/pages/sales-page-module'
import { OpportunityDetailsPageModule } from '@/vue/pages/opportunity-details-page-module'
import { SettingsPageModule } from '@/vue/pages/settings-page-module'
import { VerificationPageModule } from '@/vue/pages/verification-page-module'
import { VerificationGeneralPageModule } from '@/vue/pages/verification-general-page-module'
import { VerificationCorporatePageModule } from '@/vue/pages/verification-corporate-page-module'
import { SecurityPageModule } from '@/vue/pages/security-page-module'
import { ShowAccountIdPseudoModule } from '@/modules-arch/pseudo-modules/show-account-id-pseudo-module'
import { ChangePasswordPseudoModule } from '@/modules-arch/pseudo-modules/change-password-pseudo-module'
import { ShowSeedPseudoModule } from '@/modules-arch/pseudo-modules/show-seed-pseudo-module'
import { IssuanceDrawerPseudoModule } from '@/modules-arch/pseudo-modules/issuance-drawer-pseudo-module'
import { TransferDrawerPseudoModule } from '@/modules-arch/pseudo-modules/transfer-drawer-pseudo-module'
import { DepositFiatModule } from '@/vue/modules/deposit-fiat/module'
import { DepositFiatCardModule } from '@/vue/modules/deposit-fiat-card/module'
import { DepositFiatBankModule } from '@/vue/modules/deposit-fiat-bank/module'
import { WithdrawalFiatModule } from '@/vue/modules/withdrawal-fiat/module'
import { WithdrawalFiatCardModule } from '@/vue/modules/withdrawal-fiat-card/module'
import { WithdrawalFiatBankModule } from '@/vue/modules/withdrawal-fiat-bank/module'
import { DividendFormModule } from '@/vue/modules/dividend-form/module'
import { CreateAssetSaleModule } from '@/vue/modules/create-opportunity/module'

export default {
  importEnLocaleFile () {
    return import('@/modules-arch/schemes/reit-en.json')
  },
  pages: [
    new DashboardPageModule(
      {
        routerEntry: {
          path: '/dashboard',
          name: vueRoutes.dashboard.name,
          meta: { pageNameTranslationId: 'pages-names.dashboard' },
        },
        menuButtonTranslationId: 'pages-names.dashboard',
        menuButtonMdiName: 'view-dashboard',
        submodules: [
          new MovementsHistoryModule(),
          new IssuanceDrawerPseudoModule({
            isCorporateOnly: true,
          }),
          new TransferDrawerPseudoModule(),
        ],
      },
    ),

    new SalesPageModule(
      {
        routerEntry: {
          path: '/opportunities',
          name: vueRoutes.sales.name,
          meta: { pageNameTranslationId: 'pages-names.funds' },
        },
        menuButtonTranslationId: 'pages-names.funds',
        menuButtonMdiName: 'trending-up',
        submodules: [
          new CreateAssetSaleModule({
            isCorporateOnly: true,
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
        submodules: [
          new MovementsHistoryModule(),
          new WithdrawalFiatModule({
            submodules: [
              new WithdrawalFiatCardModule(),
              new WithdrawalFiatBankModule(),
            ],
          }),
          new DepositFiatModule({
            submodules: [
              new DepositFiatCardModule(),
              new DepositFiatBankModule(),
            ],
          }),
          new TransferDrawerPseudoModule(),
        ],
      },
    ),

    new TradePageModule(
      {
        routerEntry: {
          path: '/trade',
          name: vueRoutes.trade.name,
          meta: { pageNameTranslationId: 'pages-names.trade' },
          redirect: vueRoutes.tradeExchange,
          children: [
            // Carefully: have some issues because of is-loading prop provided
            // to children from parent component. Leave it lke that for now
            {
              path: '/trade/exchange',
              name: vueRoutes.tradeExchange.name,
              component: _ => import('@/vue/pages/TradeExchange'),
            },
            {
              path: '/trade/my-orders',
              name: vueRoutes.tradeUserOffers.name,
              component: _ => import('@/vue/pages/TradeUserOffers'),
            },
          ],
        },
        menuButtonTranslationId: 'pages-names.trade',
        menuButtonMdiName: 'finance',
      },
    ),

    new LimitsPageModule(
      {
        routerEntry: {
          path: '/limits',
          name: vueRoutes.limits.name,
          meta: { pageNameTranslationId: 'pages-names.limits' },
        },
        menuButtonTranslationId: 'pages-names.limits',
        menuButtonMdiName: 'poll-box',
      },
    ),

    new IssuancePageModule(
      {
        routerEntry: {
          path: '/issuance',
          name: vueRoutes.issuance.name,
          meta: { pageNameTranslationId: 'pages-names.issuance' },
        },
        menuButtonTranslationId: 'pages-names.issuance',
        menuButtonMdiName: 'poll',
        submodules: [
          new IssuanceExplorerModule(),
        ],
      },
    ),

    new OpportunityDetailsPageModule(
      {
        routerEntry: {
          path: '/opportunities/:id',
          name: vueRoutes.saleDetails.name,
          meta: { pageNameTranslationId: 'pages-names.fund-details' },
          redirect: to => ({ ...vueRoutes.saleCampaign, params: to.params }),
          props: true,
          children: [
            {
              path: '/opportunities/:id/campaign',
              name: vueRoutes.saleCampaign.name,
              component: _ => import('@/vue/pages/sale-details/SaleCampaignViewer'),
              props: true,
            },
          ],
        },
        submodules: [
          new DividendFormModule(),
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
              new VerificationGeneralPageModule({
                routerEntry: {
                  path: '/settings/verification/general',
                  name: vueRoutes.verificationGeneral.name,
                },
              }),
              new VerificationCorporatePageModule({
                routerEntry: {
                  path: '/settings/verification/corporate',
                  name: vueRoutes.verificationCorporate.name,
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
              new ShowAccountIdPseudoModule(),
              new ShowSeedPseudoModule(),
            ],
          }),
        ],
      }
    ),

    new FeesPageModule(
      {
        routerEntry: {
          path: '/fees',
          name: vueRoutes.fees.name,
          meta: { pageNameTranslationId: 'pages-names.fees' },
        },
        menuButtonTranslationId: 'pages-names.fees',
        menuButtonMdiName: 'flash',
        submodules: [
          new FeesModule(),
        ],
      },
    ),
  ],
}
