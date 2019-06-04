# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Please check our [developers guide](https://gitlab.com/tokend/developers-guide)
for further information about branching and tagging conventions.

## [Unreleased]
#### Added
- Placeholder of empty list for Trade, Issuance requests and Requests pages
- Tooltip directive
- Assets vuex module for loading and storing all the assets
- Whitelisted detail on sale related modules
- isTransferable policy getter to asset records
- Usage of Unix line endings rule
- Browser compatibiility check and unsupported browser page
- Password toggle button for input fields with type="password"
- Fees mixin, renderer & wrappers for unified displaying fees
- Displaying fees on issuance form & trade forms
- State icon to the status message
- Rotation of status message close icon on hovering
- `assets.module`
- `AmountInputField`
- Cap asset field to the create sale form
- Display amount + fee in movements list

#### Changed
- Now loading account converted balances in
  "LOAD_ACCOUNT_BALANCES_DETAILS" vuex action
- Now calling "UPDATE_ASSET" mutation in the
  "LOAD_ACCOUNT_BALANCES_DETAILS" action
- Now top bar buttons in movements page are conditionally disabled
- Route-to-route progress bar size and color
- Now hiding "My Sales" tab for non-corporate accounts
- Update "Learn more about pre-issuance" link style on sale creation form
- Now including offer fees to account's balance on invest form
- Now using `DocumentsManager` from SDK to upload documents to the storage
- Now getting document URL using documentsManager
- Now using light background for status messages with the type
  "success" of "info"
- Now using cap asset as default quote asset for create sale request
- Now creating quote asset balances on create sale form if they don't exist
- Now displaying accepted investment assets as base assets of pairs where
  cap asset is quote asset on create sale form
- Now displaying invest form on the sale state widget

#### Removed
- Cursor pointer on disabled select
- Price history chart from sale overview page
- Validation for address line 2
- Fixed fee from invest form
- Invest drawer from sale stae widget & opportunity details components

#### Fixed
- Don't show title in kyc status message, if no additional external information
- 'data' error in asset request list
- Successful investment sale state update
- Break words in sale description viewer
- Replace labels for submit general kyc button
- Calendar related tests for win32 systems
- Disabling invest form while submitting
- Different borders with attribute of readonly on the field

## [1.7.0-rc.2] - 2019-05-21
### "Under the hood" changes
#### Changed
- Some DevOps stuff changed

## [1.7.0-rc.1] - 2019-05-21
### "Under the hood" changes
#### Changed
- Some DevOps stuff changed

## [1.7.0-rc.0] - 2019-05-21
#### Added
- New sale whitelist support:
  - New "Whitelisted" checkbox on create sale form
  - New "Whitelisted" row to sale details drawer
  - New whitelist invitation form (shown only for the sale owner)
  - New whitelist invitations drawer
- New loading feedback when moving from one route to another (nprogress loader)
- New "Copied" tooltip message to copy icon-buttons
- New "Total" read-only field in offer creation form
- New Sentry error tracking integration
- New pre-issuance guide and links to it from pre-issuance related features
- New sale participation statistics drawer, shown only for the sale owner
- Now displaying up to three user balances in dropdown when click on user’s
  avatar at top-right of the screen
- Restored email validation on login form

#### Changed
- File field look improvements:
  - Added reactions to drag and drop actions
  - Added image preview
  - Added icons for non-image filetypes
  - Added upload icons
  - Now gray-scale painting the field when its state is disabled
  - New validation of file extension, size and dimensions in file field
- Dashboard movements changes:
  - Added "Latest activity" label
  - Now showing only 10 latest operations
  - Removed "More" button
- Now formatting date in validation message of fields with min date restriction
- Now restricting max size of uploaded files to 32mb
- Merged "Requires verification" and "Is security (requires accreditation for US
  residents)" into "Deposit method" row in asset details drawer
- New 'no-data' message for Movements, Fees and Limits table
- Now showing more highlighted disabled investing reason in Invest form
- Updated wordings:
  - Change "Account address" to "Account ID" on "Settings" page
  - Add recommendation of using Google Authenticator to 2FA screen
  - Fix typo with "some assets" on the Deposit form
- Now showing expiration date of deposit address on the Deposit form
- Moved sale view buttons:
  - Invest button to the block with investment statistics
  - View details button to under the sale heading
- Renamed "All sales" -> "Investable sales"

#### Fixed
- Added missing formatting of asset code and value to asset details drawer
- Fix a bug with chart on-hover tip when price up from 0 to some value: instead
  of "+Infinity%" now showing "+100%"
- Fixed a bug when users requesting limits changing to unlimited values
- Fixed a bug when users receive "Your transaction is invalid" if the submitted
  transaction had exceeded limits
- Fixed a bug of uploading documents on general verification form
- Fixed a bug of incorrectly shown disabled state of account type selector on
  verification page
- Some typos in EN translations
- Fixed an issue with 0 instead of converted balance on Dashboard
- Fixed an issue with displaying quote asset as currency on the line chart
- Fixed a bug that caused "Update" button to never be shown in asset details
  drawer
- Fixed displaying of sale & create sale request caps
- Bug with getting 'defaultQuoteAsset' code in the sale creation form
- Fixed annoying flickering on update on "Trade" page

#### Removed
- Removed restriction of creating sales in the past (and opportunities for REIT
  experimental feature
- Removed "dev: " prefix from displayed version

### "Under the hood" changes
#### Added
- New `BalanceNotFoundError` to the runtime errors
- New `initSync()` method to Api class
- New `MessageBox` component for displaying titled messages
- New `SALE_DEFINITION_TYPES` constant

#### Changed
- Modularized:
  - Pre-issuance form
  - Issuance form
  - Create sale form
- Now using @tokend/js-sdk@1.7.0-rc.1
- Split offer creating drawer to three new drawers
- Optimized fonts, images, SVGs
- Now using `moment().toISOString()` value instead of `moment().toString()
- Now performing actions with wallets & factors using relevant managers
- Moved horizon resources to "/v3" endpoints
- .babelrc: babel target to allowed browsers
- Now loading converted balances on the balances page
- Moved exceeding sale cap message to vuelidate error messages
- Now loading default quote asset in create sale form
  endpoint
- Clean up:
  - Now using global api.js in all modules instead of the local analogues
  - Removed wallet provided via prop to each module
  - Import api instead of Api in security page
  - Remove _config.js from modules
  - Remove storageUrl from modules
  - Now processing documents & blobs using new ApiCaller

#### Removed
- Removed unused:
  - `CreateSaleForm` component
  - `PreIssuanceForm` component
  - `requests-renderer` component
  - `mock-helper.js` unused methods
  - `DocumentContainer` unused methods
  - global SDK instance

#### Fixed
- `event.getModifierState` error on auth page
- Account balances mapping in deposit form

### Experimental features changes
#### Fixed
- Show drawer for `isDepositable` in movements-top-bar-reit

## [1.6.0] - 2019-05-09
#### Changed
- Enabled updating of pending and approved corporate kyc requests
- "Submit" btn on verification changed to "Create request" or "Update", depends
  on whether the request updatable or not

#### Fixed
- Fetching of investment fees in investing forms

### "Under the hood" changes
#### Changed
- Now using @tokend/js-sdk@1.6.0

## [1.6.0-rc.0] - 2019-05-02
#### Added
- Displaying of fees in invest form
- Displaying of a banner with block reason on every screen (for blocked users only)
- New advanced general verification form (vanilla only)
- New US verified and US accredited account roles support
- New "Security" asset type

#### Changed
- Now does not show multiple QR codes on Coinpayments deposit

#### Fixed
- Validator of available for issuance amount on sale creation form

### "Under the hood" changes
#### Added
- `usVerified` and `usAccredited` roles to key-value module
- New release sanity check script, run it on pre-push

#### Changed
- Now using @tokend/js-sdk@1.6.0-rc.0

#### Fixed
- Invalid opts of `preissuedAssetAmount` when creating an asset

## [1.6.0-x.2] - 2019-04-29
#### Added
- Re-render chart animation

#### Changed
- Now opening pre-issuance details link in new tab

### Experimental features changes
#### Fixed
- Deposit fiat drawer displaying on REIT

## [1.6.0-x.1] - 2019-04-26
#### Added
- Selected asset query parameter to URL on dashboard, movements,
  limits, and fees pages

#### Changed
- Now using more modern animation for init loader
- Now showing all the received points (360) on the chart
- Now showing zero axis line, if chart has both negative and
  positive values
- Now using default d3 ticks calculation on chart axes, so the ticks count and
  positions are not fixed now and ticks have more user-friendly values

#### Fixed
- Account verification using received link from e-mail

### "Under the hood" changes
#### Changed
- Now using @tokend/js-sdk@1.6.0-x.0
- Now using "app__button-..." classes instead of button mixins

### Experimental features changes
#### Changed
- Now selecting invoice point by loyalty account number (Loyalty)

## [1.6.0-x.0] - 2019-04-24
#### Added
- Copy button next to email values

#### Removed
- Quitted building sourcemaps for production

#### Fixed
- Fixed calculating of percent delta on line chart
- Fixed displaying of negative values on line chart
- Fixed bunch of date field issues:
  - Broken "disabled" state
  - Broken manual input. If the user input invalid date manually the field
    cleans up
  - Broken key events (enter, escape, arrow navigation)
- Fixed margin of Limits page, added "Current limits" subheading

### "Under the hood" changes
#### Changed
- Now running WDS on a nearest non-busy port. No more `EADDRINUSE` for us
- Flatpickr implementation now not via [vue-flatpickr-component](https://www.npmjs.com/package/vue-flatpickr-component),
  but via pure [flatpickr](https://www.npmjs.com/package/flatpickr) library

#### Fixed
- Fixed a bug when with initial app configuration loading at the start if the
  user was logged in but the session still not expired
- Fixed a bug with absent preloading of account balance in Coinpayments deposit
  form
- Make `<email-getter>` be inlined flex

### Experimental features changes
#### Added
- Receivable distribution chart (Loyalty)
- Receivable-payable delta chart (Loyalty)
- Account number field to the invoice form (Loyalty)

#### Changed
- Use select field instead of table for acceptable points on
  create invoice form (Loyalty)
- Now sending payment transaction to the external system instead of
  creating a blob (Loyalty)
- Corrected statistics charts data (Loyalty)

#### Fixed
- Polling when creating an invoice (Loyalty)
- Invoice transaction source account (Loyalty)
- Displaying incoming withdrawal requests (Loyalty)

## [1.5.0] - 2019-04-19
### "Under the hood changes"
#### Changed
- Now using @tokend/js-sdk@1.5.0

## [1.5.0-rc.3] - 2019-04-19
### "Under the hood changes"
#### Changed
- Now using @tokend/js-sdk@1.5.0-rc.1

## [1.5.0-rc.2] - 2019-04-19
#### Added
- Displaying of limit request details in drawer

#### Changed
- Show limits request list on top of other limits on "Limits" page
- "Issuance" labels on Issuance page renamed to "Issuance requests"

#### Removed
- Dupe team size and website fields on corporate verification
- Displaying investors quantity in sale details
- Opera from noscript

#### Fixed
- Fixed a bug with unsubmitted transfer form
- Fixed a bug with displaying verification state message
- Fixed a bug with displaying "undefined" instead of quote asset in
  dashboard’s chart
- Fixed a bug with unreadable QR code on "Downloads" page
- Fixed a bug with undisplayed verification code on general KYC form
- Fixed a bug with incorrect displaying of fees paid for recipient while
  in transfer form

### "Under the hood" changes
#### Changed
- Now getting blob types from SDK
- Now using /v3 API for getting sales
- `SaleRecord` is now parsing the resource from new API

#### Removed
- Statistics property from `SaleRecord`
- Buttons' "form" attributes

## [1.5.0-rc.1] - 2019-04-17
#### Added
- Displaying of blocked account role
- Displaying of permanently rejected verification request state

### "Under the hood" changes
#### Changed
- Now loading KYC requests in the parent verification component
- Now getting latest approved request ID in creator details of the latest
  change role request, and loading the related request itself if account
  was reset or blocked

## [1.5.0-rc.0] - 2019-04-16
#### Added
- Displaying of feedback message after successful verification request submitting
- Displaying of available base asset amount on sale creation form
- Displaying of issuance status in issuances list
- Polling ticker of order book
- URL validation of Homepage field of corporate verification form
- User auto-logout on idle activity
- Auto-populating of limit change request forms
- Two-factor validation on login & change password forms
- Enabling/disabling 2FA form in "Settings" page
- Disclaimer message about pre-issuance asset signer if press "Use mine" button

#### Changed
- Movement list items displaying changes:
  - Display total fee
  - Display operation summary (type, operation and date)
  - Display fee information only if total fee is bigger than zero
- Redesigned recovery seed page:
  - Added warning message
  - Some minor design adjustments
  - Use redesigned clipboard field with a bit darken background
- Redesigned verification state message
- Redesigned clipboard field
- Redesigned feedback status message
- Renamed "Fund(s)" to "Sale(s)" and "Token(s)" to "Asset(s)"
- Renamed "Pre-issued asset signer" to "Pre-issuance asset signer"
- Hide "Withdraw" and "Deposit" buttons accordingly to selected assets’ policies
  on "Movements" page
- Increased width of "Already in your balances" to prevent its wrapping
- Made warning color (orange) a bit brighter
- Now support inserting both of YouTube video link and YouTube video ID on
  sale creating form
- Now sorting balances on "Balances" page in desc order by total balance
  converted to default quote asset

#### Removed
- "Fee" column from the movements table

#### Fixed
- Fixed disabled state of form stepper tabs, disallow attending of pass steps
- Fixed a bug with animation flickering on drawer closing
- Fixed displaying of insufficient/absent balance message on submit trade
  offer form
- Fixed converted balance displaying on "Dashboard" page
- Fixed invalid matched fee calculation in invest form
- Fixed trade history tables top margin
- Fixed displaying of input field label in Firefox browser
- Reworded "Verification required" translations on invest form
- Reworded warning message about insufficient balance in the "Invest" form

### "Under the hood" changes
#### Added
- QR code plugin wrapper
- Default quote asset fetching from the server

#### Changed
- Now using @tokend/js-sdk@1.4.4
- Modularized:
  - Update asset form
  - Create asset form
  - Update asset form
  - Asset explorer
  - Balance explorer
  - Create asset requests
  - Update asset requests
  - Create sale requests
  - Pre-issuance requests
  - Incoming withdrawal requests
- Moved ticker interval to a config and apply it for all tickers within the app
- Moved movements modules translation filters to a mixin
- Extracted verification state message to a separate component
- Now using "qrcode.vue" package instead of "vue-qr"
- Now getting previous account role from previous KYC request instead of
  `creatorDetails` of approved reset request
- Now using main signers account id instead of accounts account ID for
  setting pre-issuance asset signer

#### Removed
- `DEFAULT_QUOTE_ASSET` field from config
- Common records wrappers:
  - `RecordWrapper` factory
  - `AssetCreateRequestRecord`
  - `AssetUpdateRequestRecord`
  - `WithdrawalDetailsRequestRecord`
  - `PreIssuanceCreateRequestRecord`
  - `SaleRequestRecord`
- Constants of horizon version prefix
- Hard-coded `REQUEST_TYPES` constant
- ID attributes from forms & charts

### Experimental features changes
#### Added
- Subject field to the create invoice form (Loyalty)
- Displaying invoice summary on create invoice form (Loyalty)
- Coinpayments deposit drawer (Reit)
- Withdrawal drawer (Reit)

#### Changes
- Now using 2 decimal points for invoice amounts (Loyalty)
- Now using "EUR" asset instead of "PET" one on the loyalty statistics
  charts (Loyalty)
- Moved redeem offer creation from the global mixin to the local store
  (UTH, Reit)

#### Removed
- Removed Transfer & deposit from the loyalty points reconciliation scheme
  (Loyalty)
- Removed useless fields and getters in the Redeem `Sale` and `Asset` records

#### Fixed
- Translations for loyalty points merchant module (Loyalty)
- Setting merchant account ID to invoice URL (Loyalty)
- Fixed bug with validation of maturity date (Reit)
- Fixed bug with getting asset pair price in opportunity creation form. Now
  opportunity creation should work for both inverted and straight asset pairs.
  (Reit)

## [1.4.0] - 2019-04-05

## [1.4.0-rc.3] - 2019-04-04
#### Fixed
- Withdrawal request creating where invalid creatorDetails were submitted

## [1.4.0-rc.2] - 2019-04-02
#### Fixed
- A bug with uneditable general verification form for brand-new users

## [1.4.0-rc.1] - 2019-04-02
#### Added
- Updating of movements list and balances on Dashboard page after transfer
  performed
- Updating of movements list on "Movements" page after transfer performed

#### Changed
- Change default chart scope to "Day"
- Swap order book and trade history on "Trades exchange" page

## [1.4.0-rc.0] - 2019-04-01
#### Added
- Improvements of input fields:
  - Added ellipsis of overflowed text
  - Added "CapsLock enabled" warning for fields with "password" type
- TokenD loading spinner at application initialization
- Trade offers cancellation in "My orders" tab on "Trade" page
- Displaying of asset policies and asset type to asset details drawer
- Confirmation before token creation request canceling
- Polling tickers:
  - Charts now poll prices
  - Passport now poll account and KYC
- Message for users with JavaScript switched off or browsers that don’t support
  JavaScript
- Client withdrawable requests:
  - Show withdrawal reviewer email address in withdrawal form
  - Added "Incoming withdrawal" tab to "Requests" page
- User avatar upload. Both general and corporate users can upload avatars
- "Closed X days ago" text for sales that were ended
- Account reset client-side support. Now showing banners with "Your account was
  reset due to X reason". Previous KYC form should be automatically populated.
- Coinpayments-deposit module (client-side integration with Coinpayments)
- Allow requesting of limits change for all account types

#### Changed
- Renamed "Subtype" table header to "Direction" on "Fees" page
- Renamed  "Sale state updated" -> "Sale closed" (state) in movements lists

#### Fixed
- Now display negative amount on balance effect viewers
- Sidebar displaying in Safari browser on small screens
- Scrolling to the top of the form after moving to a next step in:
  - Asset create form
  - Asset update form
  - Create sale form
- Bug with a sale investment total amount calculation when you were unable to
  submit an amount equal to hard cap
- Amount validation in "Withdrawal" forms now work correctly
- Asset name displaying on most screens
- Displaying long strings (asset name, sale short description) inside card-like
  components
- "Tokens" page responsive design
- Do not allow unverified users to add an asset with "KYC required" type to
  their balances
- Now forms that show "Available balance" hint show actual balance
- Sorting of order book (now descending for asks)
- Invalid start date for sales that are already started
- Fixed a bug with impossible order cancelling if user has insufficient balance
- Fixed a bug with chart line rendering

### "Under the hood" changes
#### Added
- CLI arguments support
- Module-descriptors schemes (see `src/modules-arch/README.md`)
- Experimental features section to README.md
- Custom validation rules for sales "Soft cap" and "Hard cap" values
- A feature that makes your tests execution fail if there is any `console.log`,
  `console.warn` or `console.error` call
- Account reset related stuff:
  - `isAccountRoleReseted` state field to the KYC vuex module
  - Checking for previous account role & resetting reason when loading
    KYC request
  - Checking for reset account role on verification pages
  - `resetReason` field to the `ChangeRoleRequestRecord`
- Movements history modules unit tests
- `record` getter to the `AssetRecord`

#### Changed
- Use @tokend/js-sdk@1.3.1-x.2
- Now using new account endpoint for loading fees
- Renamed `DescriptionEditor` => `MarkdownField`. Also moved to the fields
  directory & included it to the form mixin components
- Moved fees filters out of global scope to the corresponding viewer components
- One request to fetch all the account roles instead of fetching then one-by-one
- Asset loading via the loop instead of fetching by `filter[limit]=100`
- Modularized:
  - Issuance explorer page
  - Fees page
  - TopBar component

#### Removed
- Removed feature flags from config
- Removed `globalize` from asset creating forms’ `assetTypes` computed property
- Converting account role to string in `ChangeRoleRequestRecord`

#### Fixed
- Loading balances instead of account on "Movements" page
- Loading balances instead of account on withdrawal form
- Checking for KYC state, not for KYC latest data while loading KYC in the
  verification forms
- Replace translation IDs of no-data-message component with non-translatable
  analogues (should provide already translated strings now)
- Pending status updating in the "Change Limits" form
- Fixed console errors causing in "Movements" page unit tests
- Fixed `getAccountIdByEmail`’s email fetching bug of identity-getter.js
- Fixed a bug with import `mapActions` in `SubmitTradeOfferForm`

## [1.3.1-rc.0] - 2019-03-20
### "Under the hood" changes
#### Changed
- Do not throw an error if movement has an unknown effect or operation details

#### Fixed
- Not handling 'manage-asset-pair' operation details
- Fixed bug when user invested in sales but in history
  instead of 'Investment' was 'Offer'

## [1.3.0] - 2019-03-01

[Unreleased]: https://github.com/tokend/web-client/compare/1.7.0-rc.2...HEAD
[1.7.0-rc.2]: https://github.com/tokend/web-client/compare/1.7.0-rc.1...1.7.0-rc.2
[1.7.0-rc.1]: https://github.com/tokend/web-client/compare/1.7.0-rc.0...1.7.0-rc.1
[1.7.0-rc.0]: https://github.com/tokend/web-client/compare/1.6.0...1.7.0-rc.0
[1.6.0]: https://github.com/tokend/web-client/compare/1.6.0-rc.0...1.6.0
[1.6.0-rc.0]: https://github.com/tokend/web-client/compare/1.6.0-x.2...1.6.0-rc.0
[1.6.0-x.2]: https://github.com/tokend/web-client/compare/1.6.0-x.1...1.6.0-x.2
[1.6.0-x.1]: https://github.com/tokend/web-client/compare/1.6.0-x.0...1.6.0-x.1
[1.6.0-x.0]: https://github.com/tokend/web-client/compare/1.5.0...1.6.0-x.0
[1.5.0]: https://github.com/tokend/web-client/compare/1.5.0-rc.3...1.5.0
[1.5.0-rc.3]: https://github.com/tokend/web-client/compare/1.5.0-rc.2...1.5.0-rc.3
[1.5.0-rc.2]: https://github.com/tokend/web-client/compare/1.5.0-rc.1...1.5.0-rc.2
[1.5.0-rc.1]: https://github.com/tokend/web-client/compare/1.5.0-rc.0...1.5.0-rc.1
[1.5.0-rc.0]: https://github.com/tokend/web-client/compare/1.4.0...1.5.0-rc.0
[1.4.0]: https://github.com/tokend/web-client/compare/1.4.0-rc.3...1.4.0
[1.4.0-rc.3]: https://github.com/tokend/web-client/compare/1.4.0-rc.2...1.4.0-rc.3
[1.4.0-rc.2]: https://github.com/tokend/web-client/compare/1.4.0-rc.1...1.4.0-rc.2
[1.4.0-rc.1]: https://github.com/tokend/web-client/compare/1.4.0-rc.0...1.4.0-rc.1
[1.4.0-rc.0]: https://github.com/tokend/web-client/compare/1.3.1-rc.0...1.4.0-rc.0
[1.3.1-rc.0]: https://github.com/tokend/web-client/compare/1.3.0...1.3.1-rc.0
[1.3.0]: https://github.com/tokend/web-client/releases/tag/1.3.0
