const { MenuItemRoot } = require('../src/index');
const { SimpleLogger } = require('../src/lib/MenuLogger');

describe('MenuItemRoot', () => {
    let menuStructure;
    let menuItemRoot;

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
        menuItemRoot = new MenuItemRoot(menuStructure);
    });

    test('should initialize with correct properties', () => {
        expect(menuItemRoot.isRoot).toBe(true);
        expect(menuItemRoot.rootStructure).toBe(menuStructure);
    });

    test('should throw error if makeButton is not set', () => {
        expect(() => menuItemRoot.makeButton('label', 'command')).toThrow('makeButton is not set');
    });

    test('should throw error if sendMessage is not set', async () => {
        await expect(menuItemRoot.sendMessage('peerId', {})).rejects.toThrow('sendMessage is not set');
    });

    test('should throw error if editMessage is not set', async () => {
        await expect(menuItemRoot.editMessage('peerId', {})).rejects.toThrow('editMessage is not set');
    });

    test('should throw error if deleteMessage is not set', async () => {
        await expect(menuItemRoot.deleteMessage('peerId', 'messageId')).rejects.toThrow('deleteMessage is not set');
    });

    test('should set logger correctly', async () => {
        const logger = new SimpleLogger('debug');
        await menuItemRoot.init({ logger, logLevel: 'debug' });
        expect(menuItemRoot.log).toBeDefined();
    });

    test('should set makeButton correctly', async () => {
        const makeButton = jest.fn();
        await menuItemRoot.init({ makeButton });
        expect(menuItemRoot.makeButton('label', 'command')).toBeUndefined();
        expect(makeButton).toHaveBeenCalledWith('label', 'command');
    });

    test('should set sendMessage correctly', async () => {
        const sendMessage = jest.fn();
        await menuItemRoot.init({ sendMessage });
        await menuItemRoot.sendMessage('peerId', {});
        expect(sendMessage).toHaveBeenCalledWith('peerId', {});
    });

    test('should set editMessage correctly', async () => {
        const editMessage = jest.fn();
        await menuItemRoot.init({ editMessage });
        await menuItemRoot.editMessage('peerId', {});
        expect(editMessage).toHaveBeenCalledWith('peerId', {});
    });

    test('should set deleteMessage correctly', async () => {
        const deleteMessage = jest.fn();
        await menuItemRoot.init({ deleteMessage });
        await menuItemRoot.deleteMessage('peerId', 'messageId');
        expect(deleteMessage).toHaveBeenCalledWith('peerId', 'messageId');
    });

    test('should set async methods correctly', async () => {
        const sendMessageAsync = jest.fn().mockResolvedValue('sent');
        const editMessageAsync = jest.fn().mockResolvedValue('edited');
        const deleteMessageAsync = jest.fn().mockResolvedValue('deleted');

        await menuItemRoot.init({ sendMessageAsync, editMessageAsync, deleteMessageAsync });

        await expect(menuItemRoot.sendMessage('peerId', {})).resolves.toBe('sent');
        await expect(menuItemRoot.editMessage('peerId', {})).resolves.toBe('edited');
        await expect(menuItemRoot.deleteMessage('peerId', 'messageId')).resolves.toBe('deleted');
    });

    test('should append nested items correctly', async () => {
        const appendNestedSpy = jest.spyOn(menuItemRoot, 'appendNested');
        await menuItemRoot.init({});
        expect(appendNestedSpy).toHaveBeenCalled();
    });

    test('should return correct version', () => {
        expect(menuItemRoot.version).toBe(require('../package.json').version);
    });
});