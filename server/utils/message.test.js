const expect = require('expect');
const { generateMessage } = require('./message');

it('should return a message', () => {
    let message = generateMessage('Admin','Welcome to Chat');
    expect(typeof message.createdAt).toBe('number');
    expect(message.createdAt).toBeGreaterThan(0);
    expect(message.from).toBe('Admin');
    expect(message.text).toBe('Welcome to Chat');

});