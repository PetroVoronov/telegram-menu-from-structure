# Changelog

## [1.2.0](https://github.com/PetroVoronov/telegram-menu-from-structure/compare/v1.1.7...v1.2.0) (2024-10-02)


### Features

* Add support for `extraRefresh` in `MenuItemStructured`. ([fd78b27](https://github.com/PetroVoronov/telegram-menu-from-structure/commit/fd78b27cf1b9971b89aa6e23a8903db53130ef62))


### Code Refactoring

* **examples:** Update examples/simple-telegraf/menu.js and examples/simple-no-telegram-console-mode/menu.js to use extraRefresh flag in source function ([fd78b27](https://github.com/PetroVoronov/telegram-menu-from-structure/commit/fd78b27cf1b9971b89aa6e23a8903db53130ef62))
* **MenuButton:** Get rid of `MenuButtonListTypedAsync`, everything is covered by `MenuButtonListTyped` ([fd78b27](https://github.com/PetroVoronov/telegram-menu-from-structure/commit/fd78b27cf1b9971b89aa6e23a8903db53130ef62))
* **MenuItem:** Add `getBottomRow()` method in `MenuItem`. Modify getButtons() method in `MenuItem` to include `bottomRow`. ([fd78b27](https://github.com/PetroVoronov/telegram-menu-from-structure/commit/fd78b27cf1b9971b89aa6e23a8903db53130ef62))


### Continuous Integration

* Update release-please-config.json. Change order of Changelog sections. ([99a89a6](https://github.com/PetroVoronov/telegram-menu-from-structure/commit/99a89a6bdc3aca5e85f412e8dcec3745055551c0))


### Documentation

* Update README.md with additional information about sourceAsync and extraRefresh ([fd78b27](https://github.com/PetroVoronov/telegram-menu-from-structure/commit/fd78b27cf1b9971b89aa6e23a8903db53130ef62))

## [1.1.7](https://github.com/PetroVoronov/telegram-menu-from-structure/compare/v1.1.6...v1.1.7) (2024-10-02)


### Continuous Integration

* Update package-lock.json ([97447b4](https://github.com/PetroVoronov/telegram-menu-from-structure/commit/97447b498a50ab2ed3a2e31201519b08525d5789))


### Bug Fixes

* Fix MenuITem.config to pass the default values as initialization values to configuration params ([2260730](https://github.com/PetroVoronov/telegram-menu-from-structure/commit/22607308d33ef627efd78060dd1d474b6bfe0367))


### Code Refactoring

* `MenuItem.getStringLength` now uses modifier `1.2` for length, to "simulate" different length of symbols during rendering ([2260730](https://github.com/PetroVoronov/telegram-menu-from-structure/commit/22607308d33ef627efd78060dd1d474b6bfe0367))
* **examples:** Set for examples: `textSummaryMaxLength = 56` and `spaceBetweenColumns = 3` ([2260730](https://github.com/PetroVoronov/telegram-menu-from-structure/commit/22607308d33ef627efd78060dd1d474b6bfe0367))

## [1.1.6](https://github.com/PetroVoronov/telegram-menu-from-structure/compare/v1.1.5...v1.1.6) (2024-09-30)


### Code Refactoring

* **MenuButtonInput*:** Refactor MenuButton and MenuItemStructured constructors ([eeaebe7](https://github.com/PetroVoronov/telegram-menu-from-structure/commit/eeaebe7de81fe5fbfd77eb995f7010205efd1582))

## [1.1.5](https://github.com/PetroVoronov/telegram-menu-from-structure/compare/v1.1.4...v1.1.5) (2024-09-27)


### Bug Fixes

* **MenuButton:** Fix prompt for 0 or '' values ([4dd2063](https://github.com/PetroVoronov/telegram-menu-from-structure/commit/4dd2063ddbeba78a1066d70554425d235c10e666))

## [1.1.4](https://github.com/PetroVoronov/telegram-menu-from-structure/compare/v1.1.3...v1.1.4) (2024-09-27)


### Code Refactoring

* Refactor MenuButtonInputText and MenuButtonInputInteger prompt functionality to include current value and improve template handling. ([388c85e](https://github.com/PetroVoronov/telegram-menu-from-structure/commit/388c85eec6c1f7487a9b5d0e1c2a247de502d70f))

## [1.1.3](https://github.com/PetroVoronov/telegram-menu-from-structure/compare/v1.1.2...v1.1.3) (2024-09-26)


### Documentation

* Add example for a simple Telegram bot using Telegraf library ([1f0fa5d](https://github.com/PetroVoronov/telegram-menu-from-structure/commit/1f0fa5d8ef13a701ce2c70de586990e221b9390b))


### Code Refactoring

* **examples:** Added a new example for a simple Telegram bot using the Telegraf library. ([1f0fa5d](https://github.com/PetroVoronov/telegram-menu-from-structure/commit/1f0fa5d8ef13a701ce2c70de586990e221b9390b))

## [1.1.2](https://github.com/PetroVoronov/telegram-menu-from-structure/compare/v1.1.1...v1.1.2) (2024-09-26)


### Documentation

* Append details about data processing and Menu structure to README.md ([56d68ed](https://github.com/PetroVoronov/telegram-menu-from-structure/commit/56d68eda1adaf8605d4a6366227facb1ef11e175))
* Finalizing README.md ([68d5343](https://github.com/PetroVoronov/telegram-menu-from-structure/commit/68d5343ce23409fd77ce8ad85abd863020437a79))


### Code Refactoring

* **examples:** Refactor menu structure in menu.js (simple-no-telegram-console-mode) ([56d68ed](https://github.com/PetroVoronov/telegram-menu-from-structure/commit/56d68eda1adaf8605d4a6366227facb1ef11e175))
* **examples:** Small cosmetic change in `menu.js`(simple-no-telegram-console-mode). Additionally package.json for these example is improved. ([68d5343](https://github.com/PetroVoronov/telegram-menu-from-structure/commit/68d5343ce23409fd77ce8ad85abd863020437a79))
* **MenuButton:** Refactor logging. Some messages are changed to the `debug` level ([68d5343](https://github.com/PetroVoronov/telegram-menu-from-structure/commit/68d5343ce23409fd77ce8ad85abd863020437a79))

## [1.1.1](https://github.com/PetroVoronov/telegram-menu-from-structure/compare/v1.1.0...v1.1.1) (2024-09-25)


### Bug Fixes

* Fix removeValue method to process a full value key (including chatId) ([39ea4f0](https://github.com/PetroVoronov/telegram-menu-from-structure/commit/39ea4f00f571dde3ff14b60c03ff6a0ad0398f50))

## [1.1.0](https://github.com/PetroVoronov/telegram-menu-from-structure/compare/v1.0.3...v1.1.0) (2024-09-25)


### Features

* Change list of parameters for external functions `sendMessage` and `editMessage` to make them more universal and compatible with more Telegram user or bot libraries. ([1ee3ac4](https://github.com/PetroVoronov/telegram-menu-from-structure/commit/1ee3ac4134da493180115c2fce17ca14c74b0598))

## [1.0.3](https://github.com/PetroVoronov/telegram-menu-from-structure/compare/v1.0.2...v1.0.3) (2024-09-25)


### Code Refactoring

* **examples:** Finalize menu.js (simple-no-telegram-console-mode) and add support of local Menu module usage (`--local` command-line option) ([1afc0b2](https://github.com/PetroVoronov/telegram-menu-from-structure/commit/1afc0b2c92116f94e374e729badfbf4c4635a8bd))
* **examples:** Prepare pre-version of console example without interaction with Telegram ([cfcf0ec](https://github.com/PetroVoronov/telegram-menu-from-structure/commit/cfcf0ec14f2d495f74ad8c28a8ab5ee03ed7aab5))
* Fix working of the Menu without the external i18n object. ([1afc0b2](https://github.com/PetroVoronov/telegram-menu-from-structure/commit/1afc0b2c92116f94e374e729badfbf4c4635a8bd))
* **MenuButton:** Update default prompts to the simple template strings, i.e. using the %s instead of {{named_params}} ([1afc0b2](https://github.com/PetroVoronov/telegram-menu-from-structure/commit/1afc0b2c92116f94e374e729badfbf4c4635a8bd))
* **MenuItem:** i18nTranslate to use util.format to convert usual string or template strings with params to string, when external i18n object is not presented ([1afc0b2](https://github.com/PetroVoronov/telegram-menu-from-structure/commit/1afc0b2c92116f94e374e729badfbf4c4635a8bd))

## [1.0.2](https://github.com/PetroVoronov/telegram-menu-from-structure/compare/v1.0.1...v1.0.2) (2024-09-24)


### Continuous Integration

* Add simple and basic tests for the index.js ([5feab11](https://github.com/PetroVoronov/telegram-menu-from-structure/commit/5feab11bcb45d47e887e3ab3e71b89a8482290b2))


### Documentation

* Update README.md with improved formatting and very basic additional information ([f8c1f0e](https://github.com/PetroVoronov/telegram-menu-from-structure/commit/f8c1f0ef69995731ccac56047583950ef6611770))


### Bug Fixes

* Refactor MenuItemStructured to handle empty nested items in the structure ([5feab11](https://github.com/PetroVoronov/telegram-menu-from-structure/commit/5feab11bcb45d47e887e3ab3e71b89a8482290b2))

## [1.0.1](https://github.com/PetroVoronov/telegram-menu-from-structure/compare/v1.0.0...v1.0.1) (2024-09-24)


### Code Refactoring

* Refactor logger initialization in MenuItemRoot's init method ([f2d475d](https://github.com/PetroVoronov/telegram-menu-from-structure/commit/f2d475d62840d71b3fb6375664a044265482c6e8))
* Refactor logger initialization method, log and postAppend methods to make possible to have different log levels inside and outside, when the external logger is used ([c2ba259](https://github.com/PetroVoronov/telegram-menu-from-structure/commit/c2ba259cd80821c78fb5f1d0617e6b50a83b5014))
* **SimpleLogger:** Added appropriate tests ([b13ee1c](https://github.com/PetroVoronov/telegram-menu-from-structure/commit/b13ee1c9e2fac70717273a741d67297784e82243))
* **SimpleLogger:** Refactor SimpleLogger to add two static methods: `canLog` and `acceptableLevel` ([b13ee1c](https://github.com/PetroVoronov/telegram-menu-from-structure/commit/b13ee1c9e2fac70717273a741d67297784e82243))

## [1.0.0](https://github.com/PetroVoronov/telegram-menu-from-structure/compare/v0.0.1...v1.0.0) (2024-09-23)


### ⚠ BREAKING CHANGES

* Initial release

### Features

* Initial release ([b9d6464](https://github.com/PetroVoronov/telegram-menu-from-structure/commit/b9d6464898c30e00cc3c80bb702202e5ce0f0944))
