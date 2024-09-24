# Changelog

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
