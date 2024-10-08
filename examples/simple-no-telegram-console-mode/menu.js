const rl = require('readline-sync');

const args = process.argv;
let useLocal = false;
if (args.length > 2) {
  useLocal = args[2] === '--local';
}

const {MenuItemRoot, menuDefaults} = useLocal ? require('../../src/index') : require('telegram-menu-from-structure');

const data = {};

let languages;
const getLanguages = (data, force) => {
  if (languages === undefined) {
    languages = new Map([
      ['en', 'English'],
      ['de', 'German'],
      ['es', 'Spanish'],
      ['fr', 'French'],
      ['uk', 'Ukrainian'],
    ]);
  }
  if (force) {
    const lastKey = languages.size === 5 ? 'ro' : Array.from(languages)[languages.size - 1][0];
    switch (lastKey) {
      case 'ro':
        languages.delete('ro');
        languages.set('jp', 'Japanese');
        break;
      case 'jp':
        languages.delete('jp');
        languages.set('it', 'Italian');
        break;
      case 'it':
        languages.delete('it');
        languages.set('pl', 'Polish');
        break;
      case 'pl':
        languages.delete('pl');
        languages.set('ro', 'Romanian');
        break;
      default:
        break;
    }
  }
  return languages;
};

const onLanguageChange = (currentItem, key, path) => {
  logMenu('Language changed to:', currentItem[key]);
  return true;
};
const onButtonMaxCountChange = (currentItem, key, path) => {
  if (menuRoot !== null && menuRoot !== undefined) {
    if (typeof currentItem?.buttonsMaxCount === 'number') {
      menuRoot.buttonsMaxCount = currentItem?.buttonsMaxCount;
    }
  }
};

const sourceTypes = new Map([
  ['user', 'User'],
  ['bot', 'Bot'],
  ['group', 'Group'],
  ['channel', 'Channel'],
  ['topic', 'Topic'],
]);

const menuStructure = {
  isRoot: true,
  label: 'Main Menu',
  text: 'This is the main menu',
  id: 'start',
  options: {
    getValue: (key, type) => data[key],
    setValue: (key, value, type) => (data[key] = value),
    removeValue: (key) => delete data[key],
    ...{
      ...menuDefaults,
      textSummaryMaxLength: {
        default: 56,
        min: 0,
        max: 100,
        step: 1,
      },
      spaceBetweenColumns: {
        default: 3,
        min: 1,
        max: 10,
        step: 1,
      },
    },
  },
  structure: {
    configuration: {
      type: 'object',
      label: 'Configuration',
      save: (data) => logMenu('Saving configuration. Data:', JSON.stringify(data)),
      structure: {
        itemContent: {
          language: {
            type: 'string',
            presence: 'mandatory',
            editable: true,
            sourceType: 'list',
            source: getLanguages,
            extraRefresh: true,
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
    items: {
      type: 'array',
      label: 'Items',
      save: (data) => logMenu('Saving items. Data:', JSON.stringify(data)),
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
                `onSetBefore: currentItem: ${JSON.stringify(currentItem)}, key: ${key}, data: ${JSON.stringify(data)}, path: ${path}`,
              );
              if ((currentItem.label !== undefined && currentItem.type !== undefined) || data === false) {
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
};

const menuRoot = new MenuItemRoot(menuStructure);

let userMessageId = 100;
let botMessageId = 200;
let lastMessageObject = null;
const buttons = [];

function printMessage(messageObject) {
  console.log(` text: ${formatMenuText(messageObject.message)}`);
  console.log(` buttons: `);
  messageObject.buttons.forEach((buttonsRow) => {
    console.log(
        buttonsRow
          .map((button) => {
            const buttonString = formatMenuButton(button.label, buttons.length);
            buttons.push(button.label);
            return buttonString;
          })
          .join(' '),
    );
  });
}

const handler = 'user';
const userId = 'test';

async function sendMessageToBot(message) {
  userMessageId++;
  buttons.splice(0, buttons.length);
  console.clear();
  await menuRoot.onCommand(handler, userId, userMessageId, message, false);
}

async function pressButton(label) {
  if (lastMessageObject !== null) {
    for (let buttonsRow of lastMessageObject.buttons) {
      for (let button of buttonsRow) {
        if (button.label === label) {
          buttons.splice(0, buttons.length);
          console.clear();
          await menuRoot.onCommand(handler, userId, botMessageId, button.command, true);
          return button.command !== '/exit';
        }
      }
    }
  }
}

async function example() {
  await menuRoot.init({
    makeButton: (label, command) => ({label, command}),
    sendMessage: (handler, messageText, messageButtons) => {
      console.log(`Sending message to ${handler}:`);
      lastMessageObject = {message: messageText, buttons: messageButtons};
      printMessage(lastMessageObject);
      botMessageId++;
      return botMessageId;
    },
    editMessage: (handler, messageId, messageText, messageButtons) => {
      console.log(`Message with id ${messageId} to ${handler} is edited:`);
      lastMessageObject = {message: messageText, buttons: messageButtons};
      printMessage(lastMessageObject);
      return true;
    },
    deleteMessage: (handler, menuMessageId) => {
      console.log('Deleting message:', menuMessageId, 'from', menuMessageId === userMessageId ? `user "${userId}"` : 'bot');
      return true;
    },
    confirmCallBackQuery: (handler) => {
      console.log('Confirming callback query:', handler);
      return true;
    },
    logLevel: 'info',
  });

  let button = '/start';
  await sendMessageToBot(button);
  while (true) {
    if (buttons.length === 0 && lastMessageObject !== null) {
      printMessage(lastMessageObject);
    }
    const input = rl.question('Enter button Id in format "#Number" or input data (if requested):');
    if (input.startsWith('#')) {
      let buttonId = parseInt(input.substring(1));
      if (!isNaN(buttonId)) {
        if (buttonId < 0 || buttonId >= buttons.length) {
          await pressButton(button);
          console.log('Invalid button Id');
          continue;
        }
        button = buttons[buttonId];
        if (!(await pressButton(button))) {
          break;
        }
      }
    } else {
      await sendMessageToBot(input);
    }
  }
}

example();


function logMenu(...message) {
  console.log('\x1b[36m', ...message, '\x1b[0m');
}

function formatMenuText(text) {
  return `\x1b[35m${text}\x1b[0m`;
}

function formatMenuButton(label, index) {
  return `\x1b[31m(${('#' + index.toString()).padStart(4, ' ')}) \x1b[32m${label}\x1b[0m`;
}