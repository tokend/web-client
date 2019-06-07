# web-client

TokenD client application.

Known issues:

* Some tests are forcing `Vue.config.silent` flag because of a few annoying
warnings, (https://github.com/vuejs/vue-test-utils/issues/532). Remove once
migrating to Vue 2.6
* `documents` module and all it's internals are in draft, may not be released and may not be compatible with other TokenD features.
* Windows support is experimental and has known issues. Set `git config --global core.autocrlf false` to avoid line endings issues

## Experimental components

All the components listed below are experimental and can be modified or removed
in any time without any notification. We _strongly_ do not recommend usage of
any of the enrolled stuff, we do not take over any responsibility for damage
caused by it.

The following features are **experimental**:
- Documents integrity verification and access sharing:
  - `src/modules-arch/schemes/healthcare.js`
  - `src/modules-arch/schemes/healthcare.en.json`
  - `src/vue/modules/documents/*`
  - `src/vue/pages/Documents.vue`
  - `src/vue/pages/documents-page-module.js`
  - `DOCUMENT_TYPES.healthcareDocument` document type
- REIT:
  - `src/modules-arch/schemes/reit.js`
  - `src/modules-arch/schemes/reit.en.js`
  - `src/vue/modules/deposit-fiat/*`
  - `src/vue/modules/deposit-fiat-bank/*`
  - `src/vue/modules/deposit-fiat-card/*`
  - `src/vue/modules/withdrawal-fiat/*`
  - `src/vue/modules/withdrawal-fiat-bank/*`
  - `src/vue/modules/withdrawal-fiat-card/*`
  - `src/vue/modules/create-opportunity/*` (and all other opportunity-related stuff)
  - `src/vue/modules/dividend-form/*`
  - `src/vue/pages/OpportunityDetails.vue`
  - `src/vue/pages/opportunity-details-page-module.js`
  - `src/vue/modules/redeem-form/*`
- Loyalty:
  - `src/vue/pages/LoyaltyPoints.vue`
  - `src/vue/pages/LoyaltyPointsInvoices.vue`
  - `src/vue/pages/loyalty-points-invoices-page.js`
  - `src/vue/pages/loyalty-points-page-module.js`
  - `src/modules-arch/schemes/loyalty-points-merchant.en.json`
  - `src/modules-arch/schemes/loyalty-points-merchant.js`
  - `src/modules-arch/schemes/loyalty-points-reconciliation.en.json`
  - `src/modules-arch/schemes/loyalty-points-reconciliation.js`
  - `src/vue/modules/loyalty-points/*`
  - `src/vue/pages/Statistics.vue`

