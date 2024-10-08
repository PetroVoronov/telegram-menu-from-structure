const rl = require('readline-sync');
const {Telegraf, Markup} = require('telegraf');
const {message, callbackQuery} = require('telegraf/filters');

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

async function example() {
  const botAuthTokenMinimumLength = 43;
  const botToken = rl.question('Enter a Bot token:');

  if (typeof botToken === 'string' && botToken.length >= botAuthTokenMinimumLength) {
    const bot = new Telegraf(botToken);
    await menuRoot.init({
      makeButton: (label, command) => Markup.button.callback(label, command),
      sendMessageAsync: async (ctx, messageText, messageButtons) => {
        console.log(`Sending message to ${ctx.chat.id}.`);
        const sentMessage = await ctx.reply(messageText, {
          parse_mode: 'HTML',
          ...Markup.inlineKeyboard(messageButtons),
        });
        return sentMessage.message_id;
      },
      editMessageAsync: async (ctx, messageId, messageText, messageButtons) => {
        console.log(`Message with id ${messageId} to ${ctx.chat.id} is edited.`);
        await ctx.editMessageText(messageText, {
          message_id: messageId,
          parse_mode: 'HTML',
          ...Markup.inlineKeyboard(messageButtons),
        });
        return true;
      },
      deleteMessageAsync: async (ctx, menuMessageId) => {
        console.log(
          'Deleting message:',
          menuMessageId,
          'from',
          menuMessageId === data[`menuMessageId.${ctx.chat.id}`] ? 'bot' : `user "${ctx.from.id}".`,
        );
        await ctx.deleteMessage(menuMessageId);
        return true;
      },
      confirmCallBackQueryAsync: async (ctx) => {
        console.log('Confirming callback query:', ctx.callbackQuery.id);
        return await ctx.answerCbQuery();
      },
      logLevel: 'info',
    });
    bot.launch();

    bot.on(message('text'), (ctx) => {
      const message = ctx.message;
      menuRoot.onCommand(ctx, message.chat.id, message.message_id, message.text, false);
      return true;
    });
    bot.on(callbackQuery('data'), (ctx) => {
      const callback = ctx.callbackQuery;
      menuRoot.onCommand(ctx, callback.message.chat.id, callback.message.message_id, callback.data, true);
    });

    console.log('Bot is launched. Press Ctrl+C to stop.');
  } else {
    console.log('Bot token is not set. Exiting...');
  }
}

example();

function logMenu(...message) {
  console.log('\x1b[36m', ...message, '\x1b[0m');
}
