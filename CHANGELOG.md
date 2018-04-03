# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.1.1] - 2018-04-03
### Fixed
- Fix version number

## [1.1.0] - 2018-03-12
### Added
- A simple `copyfiles` task to copy files from vendor to specific directory for example
- A WordPress configuration option (in `gulp/config.js`) to generate an Asset file returning the timestamp of last generation

## [1.0.1] - 2017-06-06
## Added
- Option `--nowatch` to get back prompt after one single compilation
- `package-lock.json` from NPM 5

## Removed
 - Subtasks are now hidden from `gulp help`

## Fixed
 - JS vendors excluded from final file in first compilation (out of watch)

## Misc
 - Updated dependencies, included forced node-sass version

[Unreleased]: https://github.com/guichet/guichet/compare/v1.1.0...HEAD
[1.0.0]: https://github.com/guichet/guichet/compare/v1.0.1...v1.1.0
