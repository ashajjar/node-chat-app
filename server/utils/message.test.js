const expect = require('expect');
const { generateMessage, generateLocationMessage } = require('./message');

describe('generateMessage', () => {
    it('should return a message', () => {
        let message = generateMessage('Admin', 'Welcome to Chat');
        expect(typeof message.createdAt).toBe('number');
        expect(message.createdAt).toBeGreaterThan(0);
        expect(message.from).toBe('Admin');
        expect(message.text).toBe('Welcome to Chat');

    });
});

describe('generateLocationMessage', () => {
    it('should return a location message', () => {
        let message = generateLocationMessage('Admin', 17, 9);
        expect(typeof message.createdAt).toBe('number');
        expect(message.createdAt).toBeGreaterThan(0);
        expect(message.from).toBe('Admin');
        expect(message.url).toBe('https://www.google.com/maps?q=17,9');
    });
});