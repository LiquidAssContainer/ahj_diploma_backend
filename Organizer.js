const uuid = require('uuid');
const writeFileAndGetLink = require('./utils');

class OrganizerError extends Error {
  // коды ответа HTTP могут быть, наверное, не всегда подходящие
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

module.exports = class ChaosOrganizer {
  constructor(users) {
    this.users = users;
    this.allowedMessageTypes = ['text', 'files', 'sticker'];
  }

  async addMessage(userId, message, files) {
    const user = this.getUserById(userId);
    if (files) {
      message.files = files;
    }
    const formattedMessage = await this.formatMessage(message);
    const { messages } = user;
    messages.push(formattedMessage);

    return formattedMessage;
  }

  // валидация и форматирование сообщения
  async formatMessage(message) {
    const { type, content, files } = message;
    const isTypeValid = this.allowedMessageTypes.includes(type);
    if (!isTypeValid) {
      throw new OrganizerError(400, 'Неправильный тип сообщения');
    }

    const formattedMessage = { type, date: new Date(), id: uuid.v4() };
    if (files && type !== 'sticker') {
      formattedMessage.attachments = await this.getAttachmentsArray(files);
    }

    switch (type) {
      case 'text':
        if (typeof content !== 'string') {
          throw new OrganizerError(
            400,
            'Содержимое текста должно быть строкой',
          );
        }
        return { ...formattedMessage, content };

      case 'sticker':
        const parsedContent = JSON.parse(content);
        if (!this.isStickerValid(parsedContent)) {
          throw new OrganizerError(400, 'Неверное значение стикера');
        }
        return { ...formattedMessage, content: parsedContent };

      case 'files':
        return { ...formattedMessage };
    }
  }

  isStickerValid({ pack, id }) {
    // название пака и количество стикеров в нём, хотел по-быстрому сделать валидацию
    const stickers = { floppa: 12, persik: 8 };
    const numberId = Number(id);
    return stickers[pack] && numberId > 0 && numberId <= stickers[pack];
  }

  async getAttachmentsArray(files) {
    const attachments = {};
    const filesArr = files.length ? [...files] : [files];

    for (const file of filesArr) {
      try {
        const { filename, src, type } = await writeFileAndGetLink(file);
        if (!attachments[type]) {
          attachments[type] = [];
        }
        attachments[type].push({ filename, src });
      } catch (e) {
        throw new OrganizerError(400, e.message);
      }
    }
    return attachments;
  }

  removeMessage(userId, msgId) {
    const user = this.getUserById(userId);
    const msgIndex = this.getMessageIndexById(userId, msgId);
    user.messages.splice(msgIndex, 1);
  }

  searchByString(userId, stringToSearch) {
    const user = this.getUserById(userId);
    const { messages } = user;

    // регулярку не тестировал прям досконально, могут быть недоработки
    const separatorRegex = /[-.,\/:;?!\s|\\]/g;
    const decodedString = decodeURIComponent(stringToSearch).toLowerCase();
    const keyWords = decodedString.split(separatorRegex);

    const filteredMessages = messages.filter((msg) => {
      if (msg.type !== 'text') {
        return false;
      }
      const msgWords = msg.content.toLowerCase().split(separatorRegex);
      return keyWords.every((word) => msgWords.includes(word));
    });
    return filteredMessages;
  }

  getRecentMedia(userId, type) {
    return this.getMessagesBeforeMsgId(userId, null, type);
  }

  getRecentMessages(userId) {
    return this.getMessagesBeforeMsgId(userId, null);
  }

  getRecentFavorites(userId) {
    return this.getMessagesBeforeMsgId(userId, null, 'favorite');
  }

  getMessagesBeforeMsgId(userId, msgId, type = 'all', count = 10) {
    const { messages } = this.getUserById(userId);
    const index = msgId
      ? this.getMessageIndexById(userId, msgId) - 1
      : messages.length - 1;

    let lastMsgId;
    let messagesToSend = [];

    for (let i = index; i >= 0; i--) {
      if (messagesToSend.length === count) {
        break;
      }
      const message = messages[i];
      switch (type) {
        case 'all':
          messagesToSend.unshift(message);
          break;

        case 'favorite':
          if (message.isFavorite) {
            messagesToSend.unshift(message);
          }
          break;

        default:
          const { attachments } = message;
          if (attachments && attachments[type]) {
            messagesToSend = attachments[type].concat(messagesToSend);
            lastMsgId = message.id;
          }
      }
    }
    return ['all', 'favorites'].includes(type)
      ? messagesToSend
      : { lastMsgId, messages: messagesToSend };
  }

  addToFavorites(userId, msgId) {
    const message = this.getMessageById(userId, msgId);
    message.isFavorite = true;
  }

  removeFromFavorites(userId, msgId) {
    const message = this.getMessageById(userId, msgId);
    message.isFavorite = false;
  }

  getUserById(userId) {
    const user = this.users[userId];
    if (!user) {
      throw new OrganizerError(404, 'Указанный пользователь не найден');
    }
    return user;
  }

  getMessageIndexById(userId, msgId) {
    const { messages } = this.getUserById(userId);
    const index = messages.findIndex((msg) => msg.id === msgId);
    if (index === -1) {
      throw new OrganizerError(404, 'Сообщение с данным id не найдено');
    }
    return index;
  }

  getMessageById(userId, msgId) {
    const { messages } = this.getUserById(userId);
    const message = messages.find((msg) => msg.id === msgId);
    if (!message) {
      throw new OrganizerError(404, 'Сообщение с данным id не найдено');
    }
    return message;
  }

  // pinMessage(userId, messageId) {
  //   const user = this.getUserById(userId);
  //   user.pinned = messageId;
  // }

  // unpinMessage(userId) {
  //   const user = this.getUserById(userId);
  //   user.pinned = null;
  // }
};
