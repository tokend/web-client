# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Please check our [developers guide](https://gitlab.com/tokend/developers-guide)
for further information about branching and tagging conventions.

## [Unreleased]
#### Changed
- Required only 'Business name' field in business kyc form

## [1.0.0-rc.0] - 2019-07-25
### Added
- New 'Explore atomic swaps' page
- Simultaneous support for most common delimiters (spaces, tabs, colons, commas,
  new lines) in "Mass issuance" and "Mass invitation" forms.
- Customer UI switch

#### Changed
- Now Safari version 10 should be supported

#### Removed
- Hidden sales and polls

#### Fixed
- Customer UI switch is shown only for corporate accounts now
- Change Customer UI => Customer in EN locale
- Some minor bug fixes
- Issue when a user could not create an atomic swap if an amount is less than
  an available balance
- A bug when you cannot return from "Downloads" if the tab was opened in new tab
- A bug when page reload twice

### "Under the hood" changes
#### Added
- New config keys:
  - `PLAY_MARKET_LINK`
  - `OFFLINE_ISSUANCE_WIN_LINK`
  - `OFFLINE_ISSUANCE_MAC_LINK`
  - `OFFLINE_ISSUANCE_SOURCE_LINK`

#### Changed
- If some of the config keys are empty, the related images and links will not
  be rendered. Affects the following keys:
  - `IOS_MANIFEST_LINK`
  - `PLAY_MARKET_LINK`
  - `OFFLINE_ISSUANCE_WIN_LINK`
  - `OFFLINE_ISSUANCE_MAC_LINK`
  - `OFFLINE_ISSUANCE_SOURCE_LINK`

#### Removed
- `RECOVERY_MODE` config key due to unused anymore

[Unreleased]: https://github.com/tokend/web-client/compare/1.0.0-rc.0...HEAD
[1.0.0-rc.0]: https://github.com/tokend/web-client/releases/tag/1.0.0-rc.0
