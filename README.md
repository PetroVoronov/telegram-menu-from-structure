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
  - [Key Features](#key-features)
  - [Key Components](#key-components)
    - [Exported Items](#exported-items)
    - [Menu Structure Object](#menu-structure-object)
      - [Header Fields of the Menu Structure Object](#header-fields-of-the-menu-structure-object)
      - [Structure Field of the Menu Structure Object](#structure-field-of-the-menu-structure-object)
        - [Fields of the Submenu Item Object](#fields-of-the-submenu-item-object)
          - [Fields of the Submenu Item `structure` Object for `object` type](#fields-of-the-submenu-item-structure-object-for-object-type)
          - [Fields of the Submenu Item `structure` Object for `array` type](#fields-of-the-submenu-item-structure-object-for-array-type)
        - [How the Items of Submenu are described in the `itemContent` object](#how-the-items-of-submenu-are-described-in-the-itemcontent-object)
  - [Testing](#testing)
  - [Changelog](#changelog)
  - [Contributing](#contributing)
  - [License](#license)

## Installation

To install the package, run:

```sh
npm install telegram-menu-from-structure
```

## Key Features

* Generates a Telegram menu from a structured object
* Each submenu can be described as an object with any amount of fields or array of objects
* If a submenu is an array, it automatically generates a list of items and allows the user to modify, add or delete items
* Values of the menu items can be boolean, string, number, or array
* For boolean values, the menu item is a button that toggles the value
* For string values, the menu item is a button that allows the user to change the value via sending message to bot
* For number values it is possible to set a min, max and step values
* For array values, the menu item is a button that allows the user to add, delete or modify items in the array
* Items of the arrays can be a boolean, string, number, or object with any amount of fields
* So you can create a complex structure of menus with any amount of submenus and items
* Currently the deep of the structure is limited by maximum size of "command" in Telegram API (64 characters)


## Key Components

### Exported Items

In current version the module exports the following items:

* `MenuItemRoot` - a class that generates a menu from a structured object
* `menuDefaults` - an object with default options for the menu, which contains the following fields:
  * `columnsMaxCount` - number, the maximum number of columns in the menu
  * `rowsMaxCount` - number, the maximum number of rows in the menu
  * `textSummaryMaxLength` - number, the maximum length of the text summary of the menu item
  * `spaceBetweenColumns` - number, the number of spaces between columns
  * `cmdPrefix` - `/`, the prefix of the command that triggers the menu

### Menu Structure Object

The menu structure object is a JSON object that describes the menu. It has the following fields:

```javascript
const menuStructure = {
  isRoot: true,
  label: 'Main Menu',
  text: 'This is the main menu',
  id: 'start',
  options: {
    getValue: (key, type) => data[key],
    setValue: (key, value, type) => (data[key] = value),
    removeValue: (key) => delete data[key],
    ...menuDefaults,
  },
  structure: {
  },
};
```
#### Header Fields of the Menu Structure Object

* `isRoot` - boolean, if true, the menu is a root menu, otherwise it is a submenu
* `label` - string, the label of the menu
* `text` - string, the text of the menu
* `id` - string, the id of the menu and the command that triggers the menu with adding `/` at the beginning

* `options` - object, the options of the menu

  Contains a really important options - "links" to the functions which will manage a data behind the Menu.

  * `getValue` - function, a function that returns the value of the menu item
  * `setValue` - function, a function that sets the value of the menu item
  * `removeValue` - function, a function that removes the value of the menu item

  When the user changes the value of the menu item, the corresponding function is called.
  By default, the `key` of the data is an `id` of the main submenu (item of a `structure` object), where the `data` is an array of objects or object with the values of the subordinates items. See below in description of `structure` object.
  For example if one of the  main submenu (item of a `structure` object) has a key `item1` and it has a submenu with a key `subitem1`, the full path to the `subitem1` will be `item1.subitem1`.
  If these functions are not provided, the menu will not be able to show and change the values of the menu items.

  The next options are the options for the menu drawing and processing:

  * `columnsMaxCount` - number, the maximum number of columns in the menu
  * `rowsMaxCount` - number, the maximum number of rows in the menu
  * `textSummaryMaxLength` - number, the maximum length of the text summary of the menu item
  * `spaceBetweenColumns` - number, the number of spaces between columns

  You can or not define it or use the default values from `menuDefaults`. As it presented in the example above.

#### Structure Field of the Menu Structure Object

This field is an object that describes the structure of the menu. Each key of the object is a submenu item. The value of the key is an object that describes the submenu item.

There is two examples of the submenu item:

* Object with two fields with data

  <details>

  ```javascript
  ...
    structure: {
      configuration: {
        type: 'object',
        label: 'Configuration',
        save: () => logMenu('Saving configuration. Data:', JSON.stringify(data)),
        structure: {
          itemContent: {
            language: {
              type: 'string',
              presence: 'mandatory',
              editable: true,
              sourceType: 'list',
              source: getLanguages,
              onSetAfter: onLanguageChange,
              default: 'en',
              label: 'Menu language',
              text: 'Language of the Menu',
            },
            buttonsMaxCount: {
              type: 'number',
              subType: 'integer',
              options: {
                min: menuDefaults.buttonsMaxCount.min,
                max: menuDefaults.buttonsMaxCount.max,
                step: menuDefaults.buttonsMaxCount.step,
              },
              sourceType: 'input',
              presence: 'mandatory',
              editable: true,
              onSetAfter: onButtonMaxCountChange,
              default: menuDefaults.buttonsMaxCount.default,
              label: 'Max buttons on "page"',
              text: 'Max count of buttons on the one "page" of the menu',
            },
          },
        },
      },
    }
  ```

  In this example the `configuration` is a key of the `structure` object. It's a key which will be used to store a data object of the submenu.
  </details>

* Array of objects with several fields with data

  <details>

  ```javascript
  ...
    structure: {
      items: {
        type: 'array',
        label: 'Items',
        save: () => logMenu('Saving items. Data:', JSON.stringify(data)),
        structure: {
          primaryId: (data, isShort = false) => `${data.label} ${data.enabled ? '✅' : '❌'}`,
          label: 'Item',
          text: 'Item for example',
          itemContent: {
            label: {
              type: 'string',
              presence: 'mandatory',
              editable: true,
              sourceType: 'input',
              label: 'Label',
              text: 'Item identification label',
            },
            enabled: {
              type: 'boolean',
              presence: 'mandatory',
              editable: true,
              default: false,
              onSetBefore: (currentItem, key, data, path) => {
                logMenu(
                  `onSetBefore: currentItem: ${JSON.stringify(currentItem)}, key: ${key}, data: ${JSON.stringify(
                    data,
                  )}, path: ${path}`,
                );
                if (data.label !== undefined && data.type !== undefined || currentItem[key] === true) {
                  return true;
                } else {
                  logMenu('Item is not ready for enabling');
                  return false;
                }
              },
              label: 'Enabled',
              text: 'Enable/disable item',
            },
            type: {
              type: 'string',
              presence: 'mandatory',
              editable: true,
              sourceType: 'list',
              source: sourceTypes,
              onSetReset: ['enabled'],
              label: 'Type of source',
              text: 'Type of source, i.e. chat/group/channel',
            },
          },
        },
      },
    },
  ```

  In this example the `items` is a key of the `structure` object. It's a key which will be used to store a data array of the submenu.
  </details>

##### Fields of the Submenu Item Object

* `type` - string, the type of the submenu item. On this level it can be one of the following values:
  * `object` - the submenu item is an object with any amount of fields
  * `array` - the submenu item is an list of objects with any amount of fields
* `label` - string, the label of the submenu item
* `save` - function, a function that is called when the data of this submenu item is saved
* `structure` - description of the structure of the submenu item. It will have some differences for `object` and `array` types.

###### Fields of the Submenu Item `structure` Object for `object` type
There is only one field for `object` type:
* `itemContent` - object, the structure of the submenu item. Each key of the object is a field of the submenu item. The value of the key is an object that describes the field of the submenu item.

###### Fields of the Submenu Item `structure` Object for `array` type
There is several additional fields for `array` type:
* `primaryId` - string with Id of any field of the submenu item. Or function which will return the Id based on the data of the submenu item.
* label - string, the label of the submenu item
These two above fields are used to generate header of the submenu item.
* `text` - string with the text of the submenu item header. Or function which will return the text based on the data of the submenu item.
* `plain` - boolean, if true, the submenu items will be shown as single buttons, otherwise they will be shown as a list of buttons.
There is some specifics of "plain" structures - they are is objects too, but with one predefined field `value` which is a value of the submenu item.
* `itemContent` - object, the structure of the submenu item. Each key of the object is a field of the submenu item. The value of the key is an object that describes the field of the submenu item.

##### How the Items of Submenu are described in the `itemContent` object
The `itemContent` object has the following has an list of attributes, where the key is a field of the submenu item. The value of the key is an object that describes the field of the submenu item.
This object can have the following fields:
* `type` - string, the type of the field. It can be one of the following values:
  * `boolean` - the field is a boolean value
  * `string` - the field is a string value
  * `number` - the field is a number value
  * `array` - the field is an array of objects or values
* `presence` - string, the presence of the field. Or function which will return the presence based on the data of the submenu item. It can be one of the following values:
  * `mandatory` - the field is mandatory
  * `optional` - the field is optional, will shown if contains a value
* `editable` - boolean, if true, the field is editable
* `sourceType` - string, the source type of the field. It can be one of the following values:
  * `list` - the field is a list of values
  * `input` - the field is an input field, i.e. the user can enter a value by sending a message to the bot on request
* `source` - function, a function that returns the source of the field. It is used for the `list` source type. Should return a Map object with the values of the list
* `onSetBefore` - function, a function that is called before the value of the field is set. It can be used to check the value of the field before it is set
* `onSetAfter` - function, a function that is called after the value of the field is set
* `onSetReset` - array, an array of fields that should be reset when the value of the field is changed
* `default` - any, the default value of the field
* `label` - string, the label of the field
* `text` - string, the text of the field



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