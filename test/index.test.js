const {MenuItemRoot, menuDefaults} = require('../src/index');
const {SimpleLogger} = require('../src/lib/MenuLogger');

jest.mock('../src/lib/MenuLogger');

describe('MenuItemRoot Basic', () => {
  let menuStructure;
  let menuRoot;

  beforeEach(() => {
    menuStructure = {
      label: 'Root',
      id: 'root',
      text: 'Root Menu',
      options: {},
      structure: {
        item1: {
          label: 'Item 1',
          id: 'item1',
          structure: {},
          type: 'single',
          save: jest.fn(),
        },
      },
    };
    menuRoot = new MenuItemRoot(menuStructure);
  });

  test('should initialize with correct properties', () => {
    expect(menuRoot.isRoot).toBe(true);
    expect(menuRoot.rootStructure).toBe(menuStructure);
  });

  test('should throw error if makeButton is not set', () => {
    expect(() => menuRoot.makeButton('label', 'command')).toThrow('makeButton is not set');
  });

  test('should throw error if sendMessage is not set', async () => {
    await expect(menuRoot.sendMessage('peerId', 'test', [])).rejects.toThrow('sendMessage is not set');
  });

  test('should throw error if editMessage is not set', async () => {
    await expect(menuRoot.editMessage('peerId', 'messageId', 'test', [])).rejects.toThrow('editMessage is not set');
  });

  test('should throw error if deleteMessage is not set', async () => {
    await expect(menuRoot.deleteMessage('peerId', 'messageId')).rejects.toThrow('deleteMessage is not set');
  });

  test('should set logger correctly', async () => {
    const logger = new SimpleLogger('debug');
    await menuRoot.init({logger, logLevel: 'debug'});
    expect(menuRoot.log).toBeDefined();
  });

  test('should set makeButton correctly', async () => {
    const makeButton = jest.fn();
    await menuRoot.init({makeButton});
    expect(menuRoot.makeButton('label', 'command')).toBeUndefined();
    expect(makeButton).toHaveBeenCalledWith('label', 'command');
  });

  test('should set sendMessage correctly', async () => {
    const sendMessage = jest.fn();
    await menuRoot.init({sendMessage});
    await menuRoot.sendMessage('peerId', 'test', []);
    expect(sendMessage).toHaveBeenCalledWith('peerId', 'test', []);
  });

  test('should set editMessage correctly', async () => {
    const editMessage = jest.fn();
    await menuRoot.init({editMessage});
    await menuRoot.editMessage('peerId', 'messageId', 'test', []);
    expect(editMessage).toHaveBeenCalledWith('peerId', 'messageId', 'test', []);
  });

  test('should set deleteMessage correctly', async () => {
    const deleteMessage = jest.fn();
    await menuRoot.init({deleteMessage});
    await menuRoot.deleteMessage('peerId', 'messageId');
    expect(deleteMessage).toHaveBeenCalledWith('peerId', 'messageId');
  });

  test('should set confirmCallBackQuery correctly', async () => {
    const confirmCallBackQuery = jest.fn();
    await menuRoot.init({confirmCallBackQuery});
    await menuRoot.confirmCallBackQuery('peerId');
    expect(confirmCallBackQuery).toHaveBeenCalledWith('peerId');
  });

  test('should set async methods correctly', async () => {
    const sendMessageAsync = jest.fn().mockResolvedValue('sent');
    const editMessageAsync = jest.fn().mockResolvedValue('edited');
    const deleteMessageAsync = jest.fn().mockResolvedValue('deleted');
    const confirmCallBackQueryAsync = jest.fn().mockResolvedValue('confirmed');

    await menuRoot.init({sendMessageAsync, editMessageAsync, deleteMessageAsync, confirmCallBackQueryAsync});

    await expect(menuRoot.sendMessage('peerId', 'test', [])).resolves.toBe('sent');
    await expect(menuRoot.editMessage('peerId', 'messageId', 'test', [])).resolves.toBe('edited');
    await expect(menuRoot.deleteMessage('peerId', 'messageId')).resolves.toBe('deleted');
    await expect(menuRoot.confirmCallBackQuery('peerId')).resolves.toBe('confirmed');
  });

  test('should append nested items correctly', async () => {
    const appendNestedSpy = jest.spyOn(menuRoot, 'appendNested');
    await menuRoot.init({});
    expect(appendNestedSpy).toHaveBeenCalled();
  });

  test('should return correct version', () => {
    expect(menuRoot.version).toBe(require('../package.json').version);
  });
});

describe('MenuItemRoot Menu Manage', () => {
  let menuRoot;
  let mockMakeButton;
  let mockSendMessage;
  let mockEditMessage;
  let mockDeleteMessage;
  let mockConfirmCallBackQuery;
  let mockSave;
  let mockGetValue;
  let mockSetValue;
  let mockRemoveValue;
  let enableOnSetBefore;

  const data = {};

  const sourceTypes = new Map([
    ['user', 'User'],
    ['bot', 'Bot'],
    ['group', 'Group'],
    ['channel', 'Channel'],
    ['topic', 'Topic'],
  ]);

  beforeEach(async () => {
    mockSave = jest.fn();

    mockGetValue = jest.fn((key) => {
      return data[key];
    });
    mockSetValue = jest.fn((key, value, type) => {
      data[key] = value;
    });
    mockRemoveValue = jest.fn((key) => {
      delete data[key];
    });

    enableOnSetBefore = jest.fn((currentItem, key, data, path) => {
      return (currentItem.label !== undefined && currentItem.type !== undefined) || data === false;
    });

    const menuStructure = {
      isRoot: true,
      label: 'Main Menu',
      text: 'This is the main menu',
      id: 'start',
      options: {
        getValue: mockGetValue,
        setValue: mockSetValue,
        removeValue: mockRemoveValue,
        ...menuDefaults,
      },
      structure: {
        configuration: {
          type: 'object',
          label: 'Configuration',
          save: mockSave,
          structure: {
            itemContent: {
              language: {
                type: 'string',
                presence: 'mandatory',
                editable: true,
                sourceType: 'list',
                source: jest.fn(),
                extraRefresh: true,
                onSetAfter: jest.fn(),
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
                onSetAfter: jest.fn(),
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
          save: mockSave,
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
                onSetBefore: enableOnSetBefore,
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

    menuRoot = new MenuItemRoot(menuStructure);

    mockMakeButton = jest.fn((label, command) => ({label, command}));
    mockSendMessage = jest.fn();
    mockEditMessage = jest.fn();
    mockDeleteMessage = jest.fn();
    mockConfirmCallBackQuery = jest.fn();

    await menuRoot.init({
      makeButton: mockMakeButton,
      sendMessage: mockSendMessage,
      editMessage: mockEditMessage,
      deleteMessage: mockDeleteMessage,
      confirmCallBackQuery: mockConfirmCallBackQuery,
      logLevel: 'info',
    });
  });

  test('process /start command', async () => {
    const handler = 'user';
    const userId = 'test';
    const messageId = 100;
    const command = '/start';
    const isEvent = false;

    await menuRoot.onCommand(handler, userId, messageId, command, isEvent);

    const expectedButtons = [
      [{label: 'Configuration', command: '/configuration'}],
      [{label: 'Items []', command: '/items'}],
      [{label: 'Exit', command: '/exit'}],
    ];

    expect(mockSendMessage).toHaveBeenCalledWith(handler, 'This is the main menu', expectedButtons);
  });

  test('should process /configuration command', async () => {
    const handler = 'user';
    const userId = 'test';
    const messageId = 100;
    const command = '/configuration';
    const isEvent = true;

    await menuRoot.onCommand(handler, userId, messageId, command, isEvent);

    const expectedButtons = [
      [{label: 'Menu language [?]', command: '/configuration?language'}],
      [{label: 'Max buttons on "page" [?]', command: '/configuration?buttonsMaxCount'}],
      [
        {label: 'Back', command: '/start'},
        {label: 'Exit', command: '/exit'},
      ],
    ];

    expect(mockSendMessage).toHaveBeenCalledWith(handler, 'Configuration', expectedButtons);
  });

  test('should process /configuration?language command', async () => {
    const handler = 'user';
    const userId = 'test';
    const messageId = 100;
    const command = '/configuration?language';
    const isEvent = true;

    await menuRoot.onCommand(handler, userId, messageId, command, isEvent);

    const expectedButtons = [
      [{label: 'Refresh', command: '/configuration?language$extra=refresh'}],
      [
        {label: 'Back', command: '/configuration'},
        {label: 'Home', command: '/start'},
        {label: 'Exit', command: '/exit'},
      ],
    ];

    expect(mockSendMessage).toHaveBeenCalledWith(handler, 'Language of the Menu: "?"', expectedButtons);
  });

  test('should process /configuration?buttonsMaxCount command', async () => {
    const handler = 'user';
    const userId = 'test';
    const messageId = 100;
    const command = '/configuration?buttonsMaxCount';
    const isEvent = true;

    await menuRoot.onCommand(handler, userId, messageId, command, isEvent);

    const expectedButtons = [[{label: 'Cancel', command: '/cancel/configuration'}]];

    expect(mockSendMessage).toHaveBeenCalledWith(
      handler,
      'Current "Max count of buttons on the one "page" of the menu" value: ?.' +
        '\nPlease enter new value: [integer: min=1, max=100, step=1]',
      expectedButtons,
    );
  });

  test('should process /items command', async () => {
    const handler = 'user';
    const userId = 'test';
    const messageId = 100;
    const command = '/items';
    const isEvent = true;

    await menuRoot.onCommand(handler, userId, messageId, command, isEvent);

    const expectedButtons = [
      [{label: 'Add [?]', command: '/items@newItem'}],
      [
        {label: 'Back', command: '/start'},
        {label: 'Exit', command: '/exit'},
      ],
    ];

    expect(mockSendMessage).toHaveBeenCalledWith(handler, 'Items', expectedButtons);
  });

  test('should process /items@newItem command', async () => {
    const handler = 'user';
    const userId = 'test';
    const messageId = 100;
    const command = '/items@newItem';
    const isEvent = true;

    await menuRoot.onCommand(handler, userId, messageId, command, isEvent);

    const expectedButtons = [
      [{label: 'Label [?]', command: '/items#0?label'}],
      [{label: 'Enabled [OFF]', command: '/items#0?enabled'}],
      [{label: 'Type of source [?]', command: '/items#0?type'}],
      [{label: 'Delete [?]', command: '/items#0?@delete'}],
      [
        {label: 'Back', command: '/items'},
        {label: 'Home', command: '/start'},
        {label: 'Exit', command: '/exit'},
      ],
    ];

    expect(mockSendMessage).toHaveBeenCalledWith(handler, 'Item for example: "undefined ❌"', expectedButtons);
    expect(mockSave).toHaveBeenCalledWith([{enabled: false, label: undefined, type: undefined}]);
  });

  test('should process /items#0?label command', async () => {
    const handler = 'user';
    const userId = 'test';
    const messageId = 100;
    const command = '/items#0?label';
    const isEvent = true;

    await menuRoot.onCommand(handler, userId, messageId, command, isEvent);

    const expectedButtonsOnEdit = [[{label: 'Cancel', command: '/cancel/items#0'}]];

    const expectedButtonsAfterEdit = [
      [{label: 'Label [Test label]', command: '/items#0?label'}],
      [{label: 'Enabled [OFF]', command: '/items#0?enabled'}],
      [{label: 'Type of source [?]', command: '/items#0?type'}],
      [{label: 'Delete [?]', command: '/items#0?@delete'}],
      [
        {label: 'Back', command: '/items'},
        {label: 'Home', command: '/start'},
        {label: 'Exit', command: '/exit'},
      ],
    ];

    await menuRoot.onCommand(handler, userId, messageId, 'Test label', false);

    expect(mockSave).toHaveBeenCalledWith([{enabled: false, label: 'Test label', type: undefined}]);
    expect(mockSendMessage).toHaveBeenNthCalledWith(
      1,
      handler,
      'Current "Item identification label" value: ?.' + '\nPlease enter new value: ',
      expectedButtonsOnEdit,
    );

    expect(mockSendMessage).toHaveBeenNthCalledWith(2, handler, '1Item for example: "Test label ❌"', expectedButtonsAfterEdit);
  });

  test('should process /items#0?enabled command', async () => {
    const handler = 'user';
    const userId = 'test';
    const messageId = 100;
    const command = '/items#0?enabled';
    const isEvent = true;

    await menuRoot.onCommand(handler, userId, messageId, command, isEvent);

    expect(enableOnSetBefore).toHaveReturnedWith(false);
  });

  test('should process /items#0?type command', async () => {
    const handler = 'user';
    const userId = 'test';
    const messageId = 100;
    const command = '/items#0?type';
    const isEvent = true;

    await menuRoot.onCommand(handler, userId, messageId, command, isEvent);

    const expectedButtons = [
      [
        {label: 'User', command: '/items#0?type$v=user'},
        {label: 'Bot', command: '/items#0?type$v=bot'},
        {label: 'Group', command: '/items#0?type$v=group'},
        {label: 'Channel', command: '/items#0?type$v=channel'},
        {label: 'Topic', command: '/items#0?type$v=topic'},
      ],
      [
        {label: 'Back', command: '/items#0'},
        {label: 'Home', command: '/start'},
        {label: 'Exit', command: '/exit'},
      ],
    ];

    expect(mockSendMessage).toHaveBeenCalledWith(handler, 'Type of source, i.e. chat/group/channel: "?"', expectedButtons);
  });

  test('should process /items#0?type$v=group command', async () => {
    const handler = 'user';
    const userId = 'test';
    const messageId = 100;
    const command = '/items#0?type$v=group';
    const isEvent = true;

    await menuRoot.onCommand(handler, userId, messageId, command, isEvent);

    expect(mockSave).toHaveBeenCalledWith([{enabled: false, label: 'Test label', type: 'group'}]);

    const expectedButtons = [
      [{label: 'Label [Test label]', command: '/items#0?label'}],
      [{label: 'Enabled [OFF]', command: '/items#0?enabled'}],
      [{label: 'Type of source [Group]', command: '/items#0?type'}],
      [{label: 'Delete [?]', command: '/items#0?@delete'}],
      [
        {label: 'Back', command: '/items'},
        {label: 'Home', command: '/start'},
        {label: 'Exit', command: '/exit'},
      ],
    ];

    expect(mockSendMessage).toHaveBeenCalledWith(handler, 'Item for example: "Test label ❌"', expectedButtons);
  });

  test('should process /items#0?enabled command', async () => {
    const handler = 'user';
    const userId = 'test';
    const messageId = 100;
    const command = '/items#0?enabled';
    const isEvent = true;

    await menuRoot.onCommand(handler, userId, messageId, command, isEvent);

    expect(enableOnSetBefore).toHaveReturnedWith(true);

    expect(mockSave).toHaveBeenCalledWith([{enabled: true, label: 'Test label', type: 'group'}]);

    const expectedButtons = [
      [{label: 'Label [Test label]', command: '/items#0?label'}],
      [{label: 'Enabled [ON]', command: '/items#0?enabled'}],
      [{label: 'Type of source [Group]', command: '/items#0?type'}],
      [{label: 'Delete [?]', command: '/items#0?@delete'}],
      [
        {label: 'Back', command: '/items'},
        {label: 'Home', command: '/start'},
        {label: 'Exit', command: '/exit'},
      ],
    ];

    expect(mockSendMessage).toHaveBeenCalledWith(handler, 'Item for example: "Test label ✅"', expectedButtons);
  });
});
