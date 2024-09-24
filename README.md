# Telegram Menu generated from Structure

![NPM Version](https://img.shields.io/npm/v/telegram-menu-from-structure)
![NPM Downloads](https://img.shields.io/npm/d18m/telegram-menu-from-structure)
[![GitHub license](https://img.shields.io/github/license/PetroVoronov/telegram-menu-from-structure)](LICENSE)
[![GitHub last commit](https://img.shields.io/github/last-commit/PetroVoronov/telegram-menu-from-structure)](https://github.com/PetroVoronov/telegram-menu-from-structure/commits/main)
[![GitHub issues](https://img.shields.io/github/issues/PetroVoronov/telegram-menu-from-structure)](https://github.com/PetroVoronov/telegram-menu-from-structure/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/PetroVoronov/telegram-menu-from-structure)](https://github.com/PetroVoronov/telegram-menu-from-structure/pulls)

## About
A Telegram menu generation and processing module based on structured data.

## Table of Contents

- [Telegram Menu generated from Structure](#telegram-menu-generated-from-structure)
  - [About](#about)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Testing](#testing)
  - [Changelog](#changelog)
  - [Contributing](#contributing)
  - [License](#license)

## Installation

To install the package, run:

```sh
npm install telegram-menu-from-structure
```

## Usage

Here's a basic example of how to use the module:

```js
const { MenuItemRoot, menuDefaults } = require('telegram-menu-from-structure');

const menuStructure= {
    label: 'Main Menu',
    text: 'This is the main menu',
    id: 'start',
    options: {

    },
    structure: {
        item1: {
            label: 'Item 1',
            structure: {},
            type: 'single'
        },
        item2: {
            label: 'Item 2',
            structure: {},
            type: 'array'
        }
    }
}

const rootItem = new MenuItemRoot(menuStructure);

rootItem.init({
  makeButton: (label) => ({ text: label }),
  sendMessage: (msg) => console.log('Sending message:', msg),
  editMessage: (msg) => console.log('Editing message:', msg),
  deleteMessage: (msg) => console.log('Deleting message:', msg),
  logLevel: 'debug',
});
```

## Testing

To run tests, use the following command:

```sh
npm test
```
The tests are written using Jest and can be found in the `test` directory.

## Changelog

See the [CHANGELOG](https://github.com/PetroVoronov/telegram-menu-from-structure/blob/main/CHANGELOG.md)

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on GitHub.

## License

This project is licensed under the MIT License. See the [`LICENSE`](https://github.com/PetroVoronov/telegram-menu-from-structure/blob/main/LICENSE) file for details.