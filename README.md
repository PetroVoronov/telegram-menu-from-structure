# Telegram Menu Automated

[![NPM Version](https://img.shields.io/npm/v/telegram-menu-from-structure)](https://www.npmjs.com/package/telegram-menu-from-structure)
[![NPM Downloads](https://img.shields.io/npm/d18m/telegram-menu-from-structure)](https://www.npmjs.com/package/telegram-menu-from-structure)
[![GitHub license](https://img.shields.io/github/license/PetroVoronov/telegram-menu-from-structure)](LICENSE)
[![GitHub last commit](https://img.shields.io/github/last-commit/PetroVoronov/telegram-menu-from-structure)](https://github.com/PetroVoronov/telegram-menu-from-structure/commits/main)
[![GitHub issues](https://img.shields.io/github/issues/PetroVoronov/telegram-menu-from-structure)](https://github.com/PetroVoronov/telegram-menu-from-structure/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/PetroVoronov/telegram-menu-from-structure)](https://github.com/PetroVoronov/telegram-menu-from-structure/pulls)

## About

`Telegram Menu Automated`(telegram-menu-from-structure) is a powerful module designed to simplify the creation and management of Telegram menus based on structured data. This module allows developers to define complex menu structures using JavaScript objects, making it easy to generate dynamic and interactive Telegram bot interfaces.

With `Telegram Menu Automated`, you can create nested menus, handle user inputs, and interact with Telegram seamlessly. The module supports various data types, including booleans, strings, numbers, and arrays, and provides a flexible way to manage menu items and their states.

Whether you are building a simple bot or a complex application, `Telegram Menu Automated` offers the tools you need to create intuitive and user-friendly Telegram menus.

## Changelog

See the [CHANGELOG](https://github.com/PetroVoronov/telegram-menu-from-structure/blob/main/CHANGELOG.md)


## Table of Contents

- [Telegram Menu Automated](#telegram-menu-automated)
  - [About](#about)
  - [Changelog](#changelog)
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
    - [External functions to interact with Telegram](#external-functions-to-interact-with-telegram)
    - [Receive and process user input](#receive-and-process-user-input)
    - [Class constructor](#class-constructor)
    - [Menu initialization method](#menu-initialization-method)
  - [Usage](#usage)
    - [New instance of the `MenuItemRoot` class](#new-instance-of-the-menuitemroot-class)
    - [Initialize the menu](#initialize-the-menu)
    - [Receive and process user input](#receive-and-process-user-input-1)
      - [The example of usage the GramJs library:](#the-example-of-usage-the-gramjs-library)
      - [The example of usage the Telegraf library:](#the-example-of-usage-the-telegraf-library)
  - [Examples](#examples)
    - [Simple console example aka Demo](#simple-console-example-aka-demo)
    - [Simple Telegram bot example based on Telegraf library](#simple-telegram-bot-example-based-on-telegraf-library)
  - [Projects uses the Telegram Menu Automated](#projects-uses-the-telegram-menu-automated)
  - [Testing](#testing)
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

* Array of objects with several fields with data

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
* `primaryId` string or function - used for the identification of the submenu item. As `function(data, isShort)` which will return the Id based on the data of the submenu item.
* label - string, the label of the submenu item
These two above fields are used to generate header of the submenu item.
* `text` string or function - the text of the submenu item header. As `function(data)` which will return the text based on the data of the submenu item.
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
* `source` or `sourceAsync` function - a `function (data, force)` that returns the source of the field. It is used for the `list` source type. Should return a Map object with the values of the list. As argument it receives the `data` of the submenu item and `force` boolean flag. If `force` is true, the source should be deeply refreshed. `Force` is used only if the flag `extraRefresh` is set to `true` - see below.
* `extraRefresh` - boolean, if true, the source can be deeply refreshed. As result the additional button "Refresh" will be shown in the bottom of the list of the values. It will be used to do a deep refresh of the source. The source function should be able to process the `force` flag.
* `onSetBefore` function - a `function (data, key, value, path)` that is called before the value of the field is set. It can be used to check the value of the field before it is set
* `onSetAfter` function, a `function (data, key, path)` that is called after the value of the field is set
* `onSetReset` - array, an array of fields that should be reset when the value of the field is changed
* `default` - any, the default value of the field
* `label` string or function - the label of the field. In case of `function (data)` it should return the appropriate string value based on the data of the submenu item
* `text` string or function - the text of the field. In case of `function (data)` it should return the appropriate string value based on the data of the submenu item

Explanation of the functions parameters and return values:
* For `onSetBefore` and `onSetAfter` functions:
  * `data` - the current value of the submenu item, including all fields
  * `key` - the key of the field
  * `value` - the new value of the field (used only for `onSetBefore`)
  * `path` - array of keys as a path to the field in the submenu item, including the key of the field as the last element
  `onSetBefore` function should return `true` if the value of the field is correct and should be set, otherwise it should return `false`
* for `primaryId`:
  * `data` - the current value of the submenu item, including all fields
  * `isShort` - boolean, if true, the short version of the text should be returned. It is used to generate the header of the submenu item
  Return value should be a string with the Id of the submenu item
* for `label` and `text`:
  * `data` - the current value of the submenu item, including all fields
  Return value should be a string with the label or text of the submenu item

**Note**: only one of the `source` or `sourceAsync` should be defined. If both are defined, the `sourceAsync` will be used.

### External functions to interact with Telegram

There are four external function, dependant on the external library to work with Telegram, which should be provided to the `MenuItemRoot` class:

* The first one is a function that generates a button for the menu, acceptable by external library to work with Telegram.
  * `makeButton` - it should has the following parameters:
    * `label` - the label of the button
    * `command` - the command that triggers the button
    And should return the button object acceptable by external library to work with Telegram
* And three functions to interact with Telegram. These functions can be "usual", i.e. synchronous type or "async" type. It depends on the external library to work with Telegram. Please see details below
  * `sendMessage` or `sendMessageAsync` - a function that sends the message(Menu) to Telegram
    It should has three parameters:
    * `handler` - the unique handler, used by external library to interact with Telegram
    * `messageText` - the text part of the message(Menu)
    * `messageButtons` - the array with a buttons part of the message(Menu)
    And should return the number identifier of the newly sended message(Menu) in Telegram
  * `editMessage`  or `editMessageAsync` - a function that edits the the message(Menu) in Telegram
    It should has four parameters:
    * `handler` - the unique handler, used by external library to interact with Telegram
    * `messageId` - the number identifier of the message(Menu) in Telegram
    * `messageText` - the text part of the message(Menu)
    * `messageButtons` - the array with a buttons part of the message(Menu)
    And should return the true or false if the message was edited successfully
  * `deleteMessage`  or `deleteMessageAsync` - a function that deletes the message (user input and Menu itself)
      It should has two parameters:
    * `handler` - the unique handler, used by external library to interact with Telegram
    * `messageId` - the number identifier of the message(Menu) in Telegram
    And should return the true or false if the message was deleted successfully
  * `confirmCallBackQuery`  or `confirmCallBackQueryAsync` - a function that confirms the callback query from the menu button
    It should has only one parameters
    * `handler` - the unique handler, used by external library to interact with Telegram
    And should return the true or false if the callback query was confirmed successfully



### Receive and process user input

The main and only one method to receive and process user input is the method `onCommand` of the `MenuItemRoot` class. There is an async function which should be called on reaction of the external library to work with Telegram when the user sends a message to the bot or pressed a button in the menu.
It currently has a lot of parameters:
* `handler` - the unique handler, used by external library to interact with Telegram. For details see [Receive and process user input](#receive-and-process-user-input)
* `userId` - the unique identifier of the user in external library to work with Telegram. Used internally to separate the technical data of different users (like last message id, etc.)
* `messageId` - the number identifier of the message(Menu) in Telegram
* `command` - the command which was sent by the user. It can be a command from menu button or an user input to change the value of the menu item
* `isEvent` - boolean, if the command is an event from the menu button it has to be `true`, otherwise if it is a user input - should be `false`
* `isTarge` - boolean, should be always `false` or skipped. It is used internally


### Class constructor
Is used to create a new instance of the `MenuItemRoot` class. It has only one parameter:
* `menuStructure` - the menu structure object that describes the menu. See details in [Menu Structure Object](#menu-structure-object)

### Menu initialization method
Is used to initialize the menu. It has only one parameter:
* `menuInitializationObject` with several fields:
  * `makeButton` - the function that generates a button for the menu. Mandatory.
  The telegram interaction functions can be synchronous or asynchronous. It is **critically important** to assign this function to the appropriate type. Do not assign `async` send message function to synchronous `sendMessage` parameter of the `menuInitializationObject` and vice versa.
  * `sendMessage` or `sendMessageAsync` - the function that sends the message(Menu) to Telegram. Mandatory
  * `editMessage` or `editMessageAsync` - the function that edits the the message(Menu) in Telegram. Mandatory
  * `deleteMessage` or `deleteMessageAsync` - the function that deletes the message (user input and Menu itself). Mandatory
  * `confirmCallBackQuery` or `confirmCallBackQueryAsync` - the function that confirms the callback query from the menu button. Mandatory
  * `logLevel` - the level of logging. Can be skipped. It can be one of the following values:
    * `error` - only errors are logged
    * `warning` - errors and warnings are logged
    * `info` - errors and info messages are logged
    * `debug` - errors, info messages and debug messages are logged
  * `logger`- the instance of any external logger class. Can be skipped. The logger should have the following methods:
    * `error` - logs an error message
    * `warn` - logs a warning message
    * `info` - logs an info message
    * `debug` - logs a debug message
  * `i18n` - the instance of any external i18n class. Can be skipped. The i18n should have the following methods:
    * `__` - translates a text. Should has possibility to process formatted strings with parameters. Similar to `node:util.format`

## Usage

### New instance of the `MenuItemRoot` class

At first you should import the module and then create a new instance of the `MenuItemRoot` class with the menu structure object as a parameter:

```javascript
import { MenuItemRoot, menuDefaults } from 'telegram-menu-from-structure';
...
const menu = new MenuItemRoot(menuStructure);
```

### Initialize the menu

At second you should prepare the `makeButton` amd Telegram interaction functions and initialize the menu:

```javascript
...
const makeButton = (label, command) => {
  // Generate the button for Telegram
};

const sendMessageAsync = async (handler, messageText, messageButtons) => {
  // Send the message to Telegram
};
const editMessageAsync = async (handler, messageId, messageText, messageButtons) => {
  // Edit the message in Telegram
};
const deleteMessageAsync = async (handler, messageId) => {
  // Delete the message in Telegram
};
const confirmCallBackQueryAsync = async (handler) => {
  // Confirm the callback query in Telegram
};

menu.init({
  makeButton: makeButton,
  sendMessageAsync: sendMessageAsync,
  editMessageAsync: editMessageAsync,
  deleteMessageAsync: deleteMessageAsync,
  confirmCallBackQueryAsync: confirmCallBackQueryAsync,
  logLevel: 'debug',
  },
});
```

### Receive and process user input

#### The example of usage the [GramJs](https://github.com/gram-js/gramjs) library:

```javascript
import { MenuItemRoot, menuDefaults } from 'telegram-menu-from-structure';
import { TelegramClient } from 'telegram';
...
const client = new TelegramClient(
  ...
);

const allowedUsers = [
  ...
]; // List of allowed users
...
const menu = new MenuItemRoot(menuStructure);
...
menu.init(
  ...
);
...
function parseEvent(event) {
  let result = null;
  if (event instanceof CallbackQueryEvent) {
    const {userId, peer, msgId: messageId, data} = event.query;
    if (data !== undefined) {
      result = {userId, peer, messageId, command: data.toString(), isEvent: true};
    }
  } else if (event instanceof NewMessageEvent) {
    const {peerId: peer, id: messageId, message: command} = event.message;
    if (command !== undefined && peer.userId !== undefined) {
      result = {userId: peer.userId, peer, messageId, command, isEvent: false};
    }
  }
  return result;
}
...
const sendMessageAsync = async (event, messageText, messageButtons) => {
  if (client !== null && client.connected === true) {
    const messageObject = {message: messageText, buttons: messageButtons};
    const {peer} = parseEvent(event) || {};
    if (peer !== undefined) {
      return await client.sendMessage(peer, messageObject);
    }
  }
  return null;
};
const editMessageAsync = async (event, messageId, messageText, messageButtons) => {
  if (client !== null && client.connected === true) {
    const messageObject = {message: messageId, text: messageText, buttons: messageButtons};
    const {peer} = parseEvent(event) || {};
    if (peer !== undefined) {
      return await client.editMessage(peer, messageObject);
    }
  }
  return null;
};
const deleteMessageAsync = async (event, messageId) => {
  if (client !== null && client.connected === true) {
    const {peer} = parseEvent(event) || {};
    if (peer !== undefined) {
      return await client.deleteMessages(peer, [messageId], {revoke: true});
    }
  }
  return null;
};
const confirmCallBackQueryAsync = async (event) => {
  if (client !== null && client.connected === true && typeof event?.query?.queryId !== undefined) {
    return await event.answer();
  }
  return null;
};
...
function onCommand(event) {
  const parsedEvent = parseEvent(event);
  if (parsedEvent !== null) {
    const {userId, messageId, command, isEvent} = parsedEvent;
    if (userId !== undefined && allowedUsers.includes(Number(userId))) {
      menu.onCommand(event, userId, messageId, command, isEvent);
    }
  } else {
  }
}
...
client.addEventHandler(onCommand, new CallbackQuery({chats: allowedUsers}));
client.addEventHandler(onCommand, new NewMessage({chats: allowedUsers}));
...
```

As you can see the `event` object is used to interact with the Telegram (`handler`). It is an event object of the GramJs library.

#### The example of usage the [Telegraf](https://github.com/telegraf/telegraf) library:


```javascript
const { Telegraf, Markup } = require('telegraf');
const { MenuItemRoot, menuDefaults } = require('telegram-menu-from-structure');
...
const menu = new MenuItemRoot(menuStructure);
...
menu.init(
  ...
);
...
const bot = new Telegraf(process.env.BOT_TOKEN);
...
const makeButton = (label, command) => {
  return Markup.button.callback(label, command);
};
const sendMessageAsync = async (ctx, messageText, messageButtons) => {
  console.log(`Sending message to ${ctx.chat.id}.`);
  const sentMessage = await ctx.reply(messageText, {
    parse_mode: 'HTML',
    ...Markup.inlineKeyboard(messageButtons),
  });
};
const editMessageAsync = async (ctx, messageId, messageText, messageButtons) => {
  console.log(`Message with id ${messageId} to ${ctx.chat.id} is edited.`);
  await ctx.editMessageText(messageText, {
    message_id: messageId,
    parse_mode: 'HTML',
    ...Markup.inlineKeyboard(messageButtons),
  });
};
const deleteMessageAsync = async (ctx, menuMessageId) => {
  console.log(
    'Deleting message:',
    menuMessageId,
    'from',
    menuMessageId === data[`menuMessageId.${ctx.chat.id}`] ? 'bot' : `user "${ctx.from.id}".`,
  );
  await ctx.deleteMessage(menuMessageId);
};
const confirmCallBackQueryAsync = async (ctx) => {
  console.log('Confirming callback query:', ctx.callbackQuery.id);
  return await ctx.answerCbQuery();
};
...
bot.on(message('text'), (ctx) => {
  const message = ctx.message;
  menu.onCommand(ctx, message.chat.id, message.message_id, message.text, false);
  return true;
});
bot.on(callbackQuery('data'), (ctx) => {
  const callback = ctx.callbackQuery;
  menu.onCommand(ctx, callback.message.chat.id, callback.message.message_id, callback.data, true);
  return true;
});
```
As you can see the `ctx` object is used to interact with the Telegram (`handler`). It is a context object of the Telegraf library.


## Examples

### Simple console example aka Demo

This example is a simple console example that demonstrates how to module will work from the user point of view. It's emulates the Bot interaction with the user in the console.

**You can test this module without real Telegram bot.**

It is configured to provide two submenu items: `Configuration` and `Items`. The `Configuration` submenu item has two fields: `language` and `buttonsMaxCount`. The `Items` submenu item is an array of objects with three fields: `label`, `enabled`, and `type`.

You can go thru the menu, change the values of the fields, add, delete or modify the items of the array. The menu will show the changes in the console.
At start it will have no data, but you can manage it as you want during the work with the menu. After exit the menu the data will not be saved.

To run the example, use the following command:

```sh
cd examples/simple-no-telegram-console-mode
npm install
npm start
```

By default this example demo will use the "external" version of Menu package. It will be downloaded from the npm repository by `npm install` command.

If you want to use the local version of the Menu package, you should use the following command, instead of `npm start`:

```sh
npm run start-local
```

But ```npm install``` should be run before this command to install other required packages.

As result you will see the menu in the console and you can interact with it.
It will at start emulate the sending `/start` command to the bot and will show the result of the menu generation in the console:
```
Deleting message: 101 from user "test"
Sending message to user:
 text: This is the main menu
 buttons:
(  #0) Configuration
(  #1) Items []
(  #2) Exit
Enter button Id in format "#Number" or input data (if requested):
```

You can navigate thru the menu by input the number of the button with mandatory `#` symbol as prefix. Or you can input the data for the field of the submenu item, if it will be requested. Like this:
```
Message with id 201 to user is edited:
 text:
Please enter the "Max buttons on "page"" integer (min: 1, max: 100, step: 1) value:
 buttons:
(  #0) Cancel
Enter button Id in format "#Number" or input data (if requested):
```

Except the menu you will see the additional messages to explain the actions and results of the actions. Like this:
```
Deleting message: 101 from user "test"
```
or
```
Message with id 201 to user is edited:
```
or
```
Saving configuration. Data: {"buttonsOffset.test":0,"lastCommand.test":"/configuration?buttonsMaxCount","menuMessageId.test":201,"configuration":{"buttonsMaxCount":10}}
```

Take in account, you will work as "user" with id "test", as it is hardcoded in the example.
User messages will start from 101.
Bot messages will start from 201.

Notes:
- The example is not a real Telegram bot. It is a console application that emulates the interaction with the bot.
- If you receive errors on start, or try to use "local" mode or update an dependencies, please run `npm install`  or `npm update` to install or update the required packages.


### Simple Telegram bot example based on Telegraf library

This example is a simple Telegram bot example that demonstrates how to module will work with real Telegram bot. It's based on the [Telegraf](https://github.com/telegraf/telegraf) library.

**You can test this module only if you have a real Telegram bot token.**

Instructions how to get the token and create a bot can be found [here](https://core.telegram.org/bots/tutorial#obtain-your-bot-token).

To run the example, use the following command:

```sh
cd examples/simple-telegraf
npm install
npm start
```

By default this example demo will use the "external" version of Menu package. It will be downloaded from the npm repository by `npm install` command.

If you want to use the local version of the Menu package, you should use the following command, instead of `npm start`:

```sh
npm run start-local
```

But ```npm install``` should be run before this command to install other required packages.

You have to input the Telegram bot token on a script request. After that the bot will be started and you can interact with it in the Telegram chat.

As result you will see the menu in the Telegram chat with the bot and you can interact with it.

Additional logging will be shown in the console. You can see the what is happening with data and messages.

Notes:
- If you receive errors on start, or try to use "local" mode or update an dependencies, please run `npm install`  or `npm update` to install or update the required packages.


## Projects uses the Telegram Menu Automated

Here are some projects that utilize `Telegram Menu Automated`:

- **Telegram Forward User Bot**
   - Description: A Telegram user bot that forwards messages between chats, groups, and channels using MTProto ([gram-js/gramjs](https://github.com/gram-js/gramjs)). Fully configurable via an intuitive bot menu.
   - Repository: [GitHub Link](https://github.com/PetroVoronov/telegram-forward-user-bot)

If you have a project that uses `Telegram Menu Automated`, feel free to submit a pull request to add it to this list!


## Testing

To run tests, use the following command:

```sh
npm test
```
The tests are written using Jest and can be found in the `test` directory.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on GitHub.

## License

This project is licensed under the MIT License. See the [`LICENSE`](https://github.com/PetroVoronov/telegram-menu-from-structure/blob/main/LICENSE) file for details.