class SimpleLogger {
  // eslint-disable-next-line sonarjs/public-static-readonly
  static levels = ['debug', 'info', 'warn', 'error'];
  // eslint-disable-next-line sonarjs/public-static-readonly
  static canLog = (level, targetLevel) => SimpleLogger.levels.indexOf(level) >= SimpleLogger.levels.indexOf(targetLevel);
  // eslint-disable-next-line sonarjs/public-static-readonly
  static acceptableLevel = (level) => SimpleLogger.levels.includes(level);

  constructor(level) {
    this.level = level;
  }

  setLogLevel(level) {
    if (SimpleLogger.acceptableLevel(level)) {
      this.level = level;
    }
  }

  error(...message) {
    if (SimpleLogger.canLog('error', this.level)) {
      console.log(`ERROR: ${message}`);
    }
  }
  warn(...message) {
    if (SimpleLogger.canLog) {
      console.log(`WARN: ${message}`);
    }
  }

  info(...message) {
    if (SimpleLogger.canLog('info', this.level)) {
      console.log(`INFO: ${message}`);
    }
  }

  debug(...message) {
    if (SimpleLogger.canLog('debug', this.level)) {
      console.log(`DEBUG: ${message}`);
    }
  }
}

module.exports = {
  SimpleLogger,
};
