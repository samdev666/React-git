/* eslint-disable*/
import messages from './messages.json';

type JsonMessages = ({ [id: string]: JsonMessages | string });
export type LocalMessages = ({ [id: string]: string });

/* This uses an out parameter to avoid O(n^2) code */
export function parseMessages(parsedMessages: LocalMessages,
  prefix: string, unParsedmessages: JsonMessages) {
  Object.keys(unParsedmessages).forEach((id: string) => {
    const current = unParsedmessages[id];
    const newPrefix = prefix ? `${prefix}.${id}` : id;

    if (typeof current === 'string') {
      parsedMessages[newPrefix] = current;
    } else {
      parseMessages(parsedMessages, newPrefix, current);
    }
  });
}

export function getMessages(lang: string): LocalMessages {
  if (!(messages as any)[lang] as any) {
    throw new Error(`Attempted to load nonexistent language ${lang}`);
  }

  const parsedMessages: LocalMessages = {};
  parseMessages(parsedMessages, '', (messages as any)[lang]);

  /** @note Uncomment if want to add all locale messages in store */
  // getLanguages().forEach(langId => {
  //   parseMessages(parsedMessages, langId, (messages as any)[langId]);
  // });

  return parsedMessages;
}

export function getLanguages(): string[] {
  return Object.keys(messages);
}

// This function is O(n^2 * m^2) for languages and messages, don't call in production
export function checkMessages():void {
  const parsed = getLanguages()
    .map((lang: string) => ({ code: lang, messages: getMessages(lang) }));

  parsed.forEach(({ messages: parsedMessages }) => {
    Object.keys(parsedMessages).forEach((message) => {
      parsed.forEach((otherLanguage) => {
        if (Object.keys(otherLanguage.messages).indexOf(message) < 0) {
          /* eslint-disable-next-line no-console */
          console.warn(`Language ${otherLanguage.code} does not have message ${message}`);
        }
      });
    });
  });
}
