# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Please check our [developers guide](https://gitlab.com/tokend/developers-guide)
for further information about branching and tagging conventions.

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

[Unreleased]: https://github.com/tokend/web-client/compare/1.0.0-rc.2...HEAD
[1.0.0-rc.2]: https://github.com/tokend/web-client/compare/1.0.0-rc.1...1.0.0-rc.2
[1.0.0-rc.1]: https://github.com/tokend/web-client/compare/1.0.0-rc.0...1.0.0-rc.1
[1.0.0-rc.0]: https://github.com/tokend/web-client/releases/tag/1.0.0-rc.0
