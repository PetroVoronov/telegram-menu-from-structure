const {MenuItemRoot, menuDefaults} = require('telegram-menu-from-structure');
const rl = require('readline-sync');

const data = {};

const getLanguages = () => {
  return new Map(i18n.getLocales().map((locale) => [locale, locale]));
};
const onLanguageChange = (currentItem, key, data, path) => {
  console.log('\x1b[36m', 'Language changed to:', data[key], '\x1b[0m');
  return true;
};
const onButtonMaxCountChange = (currentItem, key, data, path) => {
  if (menuRoot !== null && menuRoot !== undefined) {
    menuRoot.buttonsMaxCount = data?.buttonsMaxCount || 10;
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
    ...menuDefaults,
  },
  structure: {
    configuration: {
      type: 'object',
      label: 'Configuration',
      save: () => console.log('\x1b[36m', 'Saving configuration. Data:', JSON.stringify(data), '\x1b[0m'),
      structure: {
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
    items: {
      type: 'array',
      label: 'Items',
      save: () => console.log('\x1b[36mSaving items. Data:', JSON.stringify(data), '\x1b[0m'),
      structure: {
        primaryId: (data, isShort = false) => `${data.label} ${data.enabled ? '✅' : '❌'}`,
        type: 'object',
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
              console.log(
                `\x1b[36m onSetBefore: currentItem: ${JSON.stringify(currentItem)}, key: ${key}, data: ${JSON.stringify(
                  data,
                )}, path: ${path}\x1b[0m`,
              );
              if (data.label !== undefined && data.type !== undefined && currentItem[key] !== false) {
                return true;
              } else {
                console.log('\x1b[36m', 'Item is not ready for enabling', '\x1b[0m');
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
  console.log(` text: \x1b[35m${typeof messageObject.message === 'string' ? messageObject.message : messageObject.text}\x1b[0m`);
  console.log(` buttons: `);
  messageObject.buttons.forEach((buttonsRow) => {
    console.log(
      `  \x1b[35m` +
        buttonsRow
          .map((button) => {
            const buttonString = '\x1b[31m(' + buttons.length.toString().padStart(3, ' ') + ') \x1b[32m' + button.label;
            buttons.push(button.label);
            return buttonString;
          })
          .join(' ') +
        `\x1b[0m`,
    );
  });
}

const peer = 'user';
const userId = 'test';

async function sendMessageToBot(message) {
  userMessageId++;
  console.clear();
  await menuRoot.onCommand(peer, userId, userMessageId, message, false);
}

async function pressButton(label) {
  if (lastMessageObject !== null) {
    for (let buttonsRow of lastMessageObject.buttons) {
      for (let button of buttonsRow) {
        if (button.label === label) {
          console.clear();
          await menuRoot.onCommand(peer, userId, botMessageId, button.command, true);
          return button.command !== '/exit';
        }
      }
    }
  }
}

async function example() {
  await menuRoot.init({
    makeButton: (label, command) => ({label, command}),
    sendMessage: (peerId, messageObject) => {
      console.log(`Sending message to ${peerId}:`);
      printMessage(messageObject);
      lastMessageObject = messageObject;
      botMessageId++;
      return {id: botMessageId};
    },
    editMessage: (peerId, messageObject) => {
      console.log(`Message with id ${messageObject.message} to ${peerId} is edited:`);
      printMessage(messageObject);
      lastMessageObject = messageObject;
      return true;
    },
    deleteMessage: (peer, menuMessageId) => {
      console.log('Deleting message:', menuMessageId, 'from', menuMessageId === userMessageId ? `user "${userId}"` : 'bot');
      return true;
    },
    logLevel: 'info',
  });


  let button = '/start';
  await sendMessageToBot(button);
  while (true) {
    if (buttons.length === 0) {
      printMessage(lastMessageObject);
    }
    const input = rl.question('Enter button Id or input data (if requested):');
    let buttonId = parseInt(input);
    if (!isNaN(buttonId)) {
      if (buttonId < 0 || buttonId >= buttons.length) {
        await pressButton(button);
        console.log('Invalid button Id');
        continue;
      }
      button = buttons[buttonId];
      buttons.splice(0, buttons.length);
      if (! await pressButton(button)) {
        break;
      }
    } else {
      await sendMessageToBot(input);
    }
  }
}

example();
