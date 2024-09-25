const {MenuItem, menuDefaults} = require('./lib/MenuItem');
const {MenuItemStructured} = require('./lib/MenuItemStructured');
const {SimpleLogger} = require('./lib/MenuLogger');
const pkgVersion = require('../package.json').version;

let log = new SimpleLogger('info');
class MenuItemRoot extends MenuItem {
  /**
   * @param {string} label - The label of the item
   * @param {string} command - The command to execute
   * @param {string} dataId - The variable id to store the data
   * @param {object} dataStructure - The structure of the data
   * @param {boolean=} isArray - The flag to indicate if the data is an array of object, not a single object
   * @param {number=} index - The index of the data item
   * @param {function=} onSave - The function to execute on save
   */

  #makeButton = null;

  #sendMessage = null;
  #editMessage = null;
  #deleteMessage = null;

  #sendMessageAsync = null;
  #editMessageAsync = null;
  #deleteMessageAsync = null;

  constructor(menuStructure) {
    super(menuStructure.label, `/${menuStructure.id}`, menuStructure.text || menuStructure.label);
    this.isRoot = true;
    this.rootStructure = menuStructure;
  }

  makeButton(label, command) {
    if (typeof this.#makeButton === 'function') {
      return this.#makeButton(label, command);
    } else {
      throw new Error('makeButton is not set');
    }
  }

  async sendMessage(peerId, messageText, messageButtons) {
    if (typeof this.#sendMessage === 'function') {
      return this.#sendMessage(peerId, messageText, messageButtons);
    } else if (typeof this.#sendMessageAsync === 'function') {
      return await this.#sendMessageAsync(peerId, messageText, messageButtons);
    } else {
      throw new Error('sendMessage is not set');
    }
  }

  async editMessage(peerId, messageId, messageText, messageButtons) {
    if (typeof this.#editMessage === 'function') {
      return this.#editMessage(peerId, messageId, messageText, messageButtons);
    } else if (typeof this.#editMessageAsync === 'function') {
      return await this.#editMessageAsync(peerId, messageId, messageText, messageButtons);
    } else {
      throw new Error('editMessage is not set');
    }
  }

  async deleteMessage(peerId, messageId) {
    if (typeof this.#deleteMessage === 'function') {
      return this.#deleteMessage(peerId, messageId);
    } else if (typeof this.#deleteMessageAsync === 'function') {
      return await this.#deleteMessageAsync(peerId, messageId);
    } else {
      throw new Error('deleteMessage is not set');
    }
  }

  async init({
    makeButton,
    sendMessage,
    editMessage,
    deleteMessage,
    sendMessageAsync,
    editMessageAsync,
    deleteMessageAsync,
    logLevel = '',
    logger = null,
    i18n = null,
  }) {
    if (this.setLogger(logger, logLevel)) {
      this.log('debug', 'Logger is set to external logger');
    } else if (this.setLogger(new SimpleLogger(logLevel || 'info'))) {
      this.log('debug', 'Logger is set to SimpleLogger');
    } else {
      this.log('error', 'Logger is not set');
    }
    this.i18n = i18n;
    this.config(this.rootStructure.options);
    if (typeof makeButton === 'function') {
      this.#makeButton = makeButton;
      this.log('debug', 'makeButton is set');
    }
    if (typeof sendMessage === 'function') {
      this.#sendMessage = sendMessage;
      this.log('debug', 'sendMessage is set');
    }
    if (typeof editMessage === 'function') {
      this.#editMessage = editMessage;
      this.log('debug', 'editMessage is set');
    }
    if (typeof deleteMessage === 'function') {
      this.#deleteMessage = deleteMessage;
      this.log('debug', 'deleteMessage is set');
    }
    if (typeof sendMessageAsync === 'function') {
      this.#sendMessageAsync = sendMessageAsync;
      this.log('debug', 'sendMessageAsync is set');
    }
    if (typeof editMessageAsync === 'function') {
      this.#editMessageAsync = editMessageAsync;
      this.log('debug', 'editMessageAsync is set');
    }
    if (typeof deleteMessageAsync === 'function') {
      this.#deleteMessageAsync = deleteMessageAsync;
      this.log('debug', 'deleteMessageAsync is set');
    }
    for (const key of Object.keys(this.rootStructure.structure)) {
      const item = this.rootStructure.structure[key];
      await this.appendNested(new MenuItemStructured(item.label, `/${key}`, key, item.structure, item.type === 'array', -1, item.save));
    }
  }

  get version() {
    return pkgVersion;
  }
}

module.exports = {
  MenuItemRoot,
  menuDefaults,
};
