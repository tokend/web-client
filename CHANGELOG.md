# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Please check our [developers guide](https://gitlab.com/tokend/developers-guide)
for further information about branching and tagging conventions.

## [Unreleased]
### Fixed
- Amount validation in the Withdrawal form

## [1.0.0-rc.7] - 2019-02-27
### Added
- `assetType` to `asset.record`
- Loader to `AssetCreateForm`
- `assetType` to `asset-create.record`
- `<router-link>` to the `SaleCard` component
- `UserDoesntExistError` handling
- Message while loading assets & balances on the movements page
- No data messages for `AssetsExplore` & `Balances` pages
- "Use mine" button for pre-issued asset signer field on the `AssetCreateForm`
- Message about no assets pairs exists in the system

### Fixed
- Fixed bug with displaying isRequiresKYC in AssetRequestDetails
- Fix bug with assetType select
- Removed displaying assetType in AssetUpdateRequestRecord
- Bug with displaying `isRequiresKYC` in `AssetRequestDetails`
- Bug with assetType select
- Wrapping sale description into a blob on the `CreateSaleForm`
- Sale description loading
- Hiding `More` button while loading the movements
- Displaying percent fees & fee assets on the fees page
- Trade chart displaying
- Buttons position on Verify page
- Drop down text overflow

### Added
- Added assetType in to asset.record
- Add loader in to AssetCreateForm
- Add assetType in to asset-create.record
- Add error handling UserDoesntExistError
- Add NotFound error handler in to recovery form

### Changed
- Remove in AssetUpdateForm tick-field 'requiresKyc'
- Rename `isUpdate` -> `isUpdateMode` on the `CreateSaleForm`
- Favicon
- Contact email in terms (now enterprise@distributedlab.com)
- `vueRoutes` structure: no nested routes
- Withdrawal validation message

### Removed
- Escape pressing handler in Drawer. The Drawer will no longer close by clicking on Escape button
- Ability to enter date manually in all date fields
- Tick field `requiresKyc` from `AssetUpdateForm`
- `viewSale` method from `Sales` component
- Displaying `assetType` in `AssetUpdateRequestRecord`

## [1.0.0-rc.6] - 2019-02-25
### Fixed
- Closing `CreateSaleForm` after submitting
- Using asset records instead of asset codes in `CreateSaleForm`
- Populating `CreateSaleForm`
- Using `saleEnumType` for sale type

## [1.0.0-rc.5] - 2019-02-25
### Fixed
- Add loadKvEntriesAccountRoleIds after sign in
- Lower case email before submitting on Login, Sign up and Recovery
- Ability to update pending sale & asset requests
- Request details fields:
  - `preIssuanceCreate` -> `createPreIssuance`
  - `assetCreate` -> `createAsset`
- `LimitsUpdateRequestRecord` `updateLimits` details field
- Asset request records mocks & unit tests

### Changed
- Local environment from `anubis` to `angus`
- `LimitsUpdateRequestRecord` field `requestType` to `limitsRequestType`

## [1.0.0-rc.4] - 2019-02-23
### Added
- `Api` class, representing SDK class `ApiCaller`
- `ACCOUNT_ROLES` constant to the config
- `REQUEST_TYPES` constant
- `ChangeRoleRequestRecord` wrapper for change role requests
- `Api` instance to the `MockHelper`
- `JsonapiResponse` to the `MockWrapper`
- vuex module for API `key-value` storage
- `UserDoesntExistError`, when user's account is not found
- `IdentityGetterMixin` for getting user's email by their account ID & vice versa
- Loading account roles from the key-value storage
- The message about token existing in user balances after chose some token on the Explore tokes page

### Fixed
- `RecordWrapper.request`, `RequestRecord` according to the new request types
- failed unit tests

### Changed
- Use sdk version 1.0.0-x.15
- Use `Api` class for the new API requests
- Use `accountRoleId` instead of `accountType`
- Use `vuexTypes.accountId` getter instead of `vuexTypes.account.accountId` one
- Use `CreateChangeRoleRequestBuilder.createChangeRoleRequest` instead of `CreateUpdateKYCRequestBuilder.createUpdateKYCRequest`
- Use `IdentityGetterMixin` for getting account ID & email in `EmailGetter`, `IssuanceForm` & `TransferForm`
- Use `vuexTypes.kvEntryGeneralRoleId` & `vuexTypes.kvEntryCorporateRoleId` for making chane role operation
- Change role request mocks according to the new API responses
- Passing `creatorDetails` instead of `externalDetails` param in the `createIssuanceRequest`
- Passing `creatorDetails` instead of `externalDetails` param in the `createWithdrawWithAutoConversion`
- Passing `creatorDetails` instead of `details` in the `assetCreationRequest`
- Passing `creatorDetails` instead of `details` in the `assetUpdateRequest`
- Passing `creatorDetails` instead of `details` in the `createSaleCreationRequest`
- Rename PaymentV2 builder to Payment builder
- Renamed request types:
  - `xdr.ReviewableRequestType.preIssuanceCreate` -> `xdr.ReviewableRequestType.createPreIssuance`
  - `xdr.ReviewableRequestType.issuanceCreate` -> `xdr.ReviewableRequestType.createIssuance`
  - `xdr.ReviewableRequestType.sale` -> `xdr.ReviewableRequestType.createSale`
  - `xdr.ReviewableRequestType.limitsUpdate` -> `xdr.ReviewableRequestType.updateLimit`
  - `xdr.ReviewableRequestType.amlAlert` -> `xdr.ReviewableRequestType.createAmlAlert`
  - `xdr.ReviewableRequestType.updateKyc` -> `xdr.ReviewableRequestType.changeRole`
  - `xdr.ReviewableRequestType.assetCreate` -> `xdr.ReviewableRequestType.createAsset`
  - `xdr.ReviewableRequestType.assetUpdate` -> `xdr.ReviewableRequestType.updateAsset`
- Renamed fields with names like `details` to `creatorDetails` according to new XDR structs
  - `createAmlAlert (opts)`:
    - field `opts.reason -> opts.creatorDetails`
  - `createWithdrawWithAutoConversion (opts)`:
    - field `opts.externalDetails -> opts.creatorDetails`
  - `assetCreationRequest (opts)`:
    - field `opts.details -> opts.creatorDetails`
  - `assetUpdateRequest (opts)`:
    - field `opts.details -> opts.creatorDetails`
  - `createSaleCreationRequest (opts)`:
    - field `opts.details -> opts.creatorDetails`
  - `createIssuanceRequest (opts)`:
    - field `opts.externalDetails -> opts.creatorDetails`
  - `createChangeRoleRequest (opts)`:
    - field `opts.kycData -> opts.creatorDetails`
  - `createUpdateSaleDetailsRequest (opts)`:
    - field `opts.newDetails -> opts.creatorDetails`
  - `createPreIssuanceRequestOp (opts)`:
    - introduced field `opts.creatorDetails`

### Removed
- Passing `kycLevelToSet` to `CreateChangeRoleRequestBuilder.createChangeRoleRequest`
- Unnecessary test mocks
- `UpdateKycRequestRecord` (replaced by `ChangeRoleRequestRecord`)
- Use of `ACCOUNT_TYPES` constant
- Countries list from `VerificationGeneralForm`
- Unused vuex getters

## [1.0.0-rc.3] - 2019-02-21
### Added
- CSS rule that prevents any events on disabled buttons.

### Fixed
- Trade offer validations. Earlier, the user was able to enter invalid value without some error message but he cannot be able to send from, so it was confusing for him.
- Fix bug with asset create (lost `trailingDigitsCount` in op)
- Withdrawal form displaying

## [1.0.0-rc.2] - 2019-02-20
### Added
- Build version displaying

## [1.0.0-rc.1] - 2019-02-20
### Added
- `AssetPairRecord` for wrapping asset pairs
- Ability to cancel your trade order
- User account blocked error
- Transaction error
- Loading state for trades & operations pages
- Disabling select filters while loading

### Changed
- `MatchRecord` initialization
- Displaying base & quote amount on `MatchOpDetails`
- Moved `TradeTopBar` to the root `Trade` component
- `Requests` menu item is shown only for syndicate users
- Use sdk version 1.0.0-x.9

### Removed
- Outdated license file

### Fixed
- Displaying only tradable asset pairs on the trade page
- Chart margins
- Displaying order match operations
- Parsing operations on dashboard page
- Balances update after creating/updating your trade order
- Using `NoDataMessage` on operations page
- Auto login after recovery seed screen of sign-up
- Fixed many minor markup issues when no logged-in user have no balances at all

## [1.0.0-rc.0] - 2019-02-18

[Unreleased]: https://github.com/tokend/web-client/compare/1.0.0-rc.7...HEAD
[1.0.0-rc.7]: https://github.com/tokend/web-client/compare/1.0.0-rc.6...1.0.0-rc.7
[1.0.0-rc.6]: https://github.com/tokend/web-client/compare/1.0.0-rc.5...1.0.0-rc.6
[1.0.0-rc.5]: https://github.com/tokend/web-client/compare/1.0.0-rc.4...1.0.0-rc.5
[1.0.0-rc.4]: https://github.com/tokend/web-client/compare/1.0.0-rc.3...1.0.0-rc.4
[1.0.0-rc.3]: https://github.com/tokend/web-client/compare/1.0.0-rc.2...1.0.0-rc.3
[1.0.0-rc.2]: https://github.com/tokend/web-client/compare/1.0.0-rc.1...1.0.0-rc.2
[1.0.0-rc.1]: https://github.com/tokend/web-client/compare/1.0.0-rc.0...1.0.0-rc.1
[1.0.0-rc.0]: https://github.com/tokend/web-client/releases/tag/1.0.0-rc.0
