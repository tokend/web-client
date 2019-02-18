# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Please check our [developers guide](https://gitlab.com/tokend/developers-guide)
for further information about branching and tagging conventions.

## [Unreleased]
### Added
- `AssetPairRecord` for wrapping asset pairs
- Ability to cancel your trade order
- User account blocked error
- Transaction error

### Changed
- `MatchRecord` initialization
- displaying base & quote amount on `MatchOpDetails`

### Removed
- Outdated license file

### Fixed
- Displaying only tradable asset pairs on the trade page
- Chart margins
- Displaying order match operations
- Parsing operations on dashboard page
- Balances update after creating/updating your trade order

## [1.0.0-rc.0] - 2019-02-18

[Unreleased]: https://github.com/tokend/web-client/compare/1.0.0-rc.1...HEAD
[1.0.0-rc.0]: https://github.com/tokend/web-client/releases/tag/1.0.0-rc.0
