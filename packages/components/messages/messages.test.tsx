// messages.test.ts
import {
  parseMessages,
  getMessages,
  getLanguages,
  checkMessages,
} from './messages';

jest.mock('../messages/messages.json', () => ({
  en: {
    greeting: 'Hello',
    nested: {
      welcome: 'Welcome',
      goodbye: 'Goodbye',
    },
  },
  es: {
    greeting: 'Hola',
    nested: {
      welcome: 'Bienvenido',
    },
  },
}));

describe('parseMessages', () => {
  it('correctly parses messages into local format', () => {
    const parsedMessages = {};
    parseMessages(parsedMessages, '', {
      greeting: 'Hello',
      nested: {
        welcome: 'Welcome',
        goodbye: 'Goodbye',
      },
    });

    expect(parsedMessages).toEqual({
      greeting: 'Hello',
      'nested.welcome': 'Welcome',
      'nested.goodbye': 'Goodbye',
    });
  });
});

describe('getMessages', () => {
  it('throws an error for nonexistent language', () => {
    expect(() => getMessages('nonexistent')).toThrowError(
      'Attempted to load nonexistent language nonexistent',
    );
  });

  it('returns messages for a valid language', () => {
    const messages = getMessages('en');
    expect(messages).toEqual({
      greeting: 'Hello',
      'nested.welcome': 'Welcome',
      'nested.goodbye': 'Goodbye',
    });
  });
});

describe('getLanguages', () => {
  it('returns an array of supported languages', () => {
    const languages = getLanguages();
    expect(languages).toEqual(['en', 'es']);
  });
});

describe('checkMessages', () => {
  it('warns if a message is missing in any language', () => {
    const consoleWarnSpy = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => {});

    checkMessages();

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining('does not have message'),
    );

    consoleWarnSpy.mockRestore();
  });
});
