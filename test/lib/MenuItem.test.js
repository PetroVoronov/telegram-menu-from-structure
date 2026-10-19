const {MenuItem, menuDefaults} = require('../../src/lib/MenuItem');

describe('MenuItem.getStringLength', () => {
    const scaled = (length) => Math.ceil(length * menuDefaults.wideCharactersCountCoefficient);

    test('should return 0 for empty or non-string values', () => {
        expect(MenuItem.getStringLength('')).toBe(0);
        expect(MenuItem.getStringLength(undefined)).toBe(0);
        expect(MenuItem.getStringLength(null)).toBe(0);
        expect(MenuItem.getStringLength(42)).toBe(0);
    });

    test('should count plain text by its length', () => {
        expect(MenuItem.getStringLength('Settings')).toBe(scaled(8));
    });

    test('should count a single emoji as 2 characters', () => {
        // '🙂' is a surrogate pair, i.e. already 2 UTF-16 code units
        expect(MenuItem.getStringLength('Rules 🙂')).toBe(scaled(8));
        // '✅' is a single UTF-16 code unit
        expect(MenuItem.getStringLength('✅ Done')).toBe(scaled(7));
    });

    test('should count multi code point emoji as 2 characters', () => {
        // family (ZWJ sequence), flag (regional indicators), skin tone modifier, keycap
        expect(MenuItem.getStringLength('👨‍👩‍👧 Family')).toBe(scaled(9));
        expect(MenuItem.getStringLength('🇺🇦 Ukraine')).toBe(scaled(10));
        expect(MenuItem.getStringLength('👍🏽 ok')).toBe(scaled(5));
        expect(MenuItem.getStringLength('1️⃣ one')).toBe(scaled(6));
    });

    test('should count every emoji in a string', () => {
        expect(MenuItem.getStringLength('🙂🙂 ✅')).toBe(scaled(7));
    });
});
