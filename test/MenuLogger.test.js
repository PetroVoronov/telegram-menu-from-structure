const { SimpleLogger } = require('../src/lib/MenuLogger');

describe('SimpleLogger', () => {
    let logger;
    let consoleSpy;

    beforeEach(() => {
        consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
        consoleSpy.mockRestore();
    });

    test('should log error messages when level is error', () => {
        logger = new SimpleLogger('error');
        logger.error('This is an error message');
        expect(consoleSpy).toHaveBeenCalledWith('ERROR: This is an error message');
    });

    test('should not log info messages when level is error', () => {
        logger = new SimpleLogger('error');
        logger.info('This is an info message');
        expect(consoleSpy).not.toHaveBeenCalled();
    });

    test('should log warn messages when level is warn', () => {
        logger = new SimpleLogger('warn');
        logger.warn('This is a warn message');
        expect(consoleSpy).toHaveBeenCalledWith('WARN: This is a warn message');
    });

    test('should log info messages when level is info', () => {
        logger = new SimpleLogger('info');
        logger.info('This is an info message');
        expect(consoleSpy).toHaveBeenCalledWith('INFO: This is an info message');
    });

    test('should log debug messages when level is debug', () => {
        logger = new SimpleLogger('debug');
        logger.debug('This is a debug message');
        expect(consoleSpy).toHaveBeenCalledWith('DEBUG: This is a debug message');
    });

    test('should change log level using setLogLevel', () => {
        logger = new SimpleLogger('error');
        logger.setLogLevel('info');
        logger.info('This is an info message');
        expect(consoleSpy).toHaveBeenCalledWith('INFO: This is an info message');
    });

    test('should not change log level to an invalid level', () => {
        logger = new SimpleLogger('error');
        logger.setLogLevel('invalid');
        logger.info('This is an info message');
        expect(consoleSpy).not.toHaveBeenCalled();
    });
});