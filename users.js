module.exports = {
  test: {
    messages: [
      {
        type: 'text',
        id: '1',
        date: '2021-07-04T15:07:17.447Z',
        content: 'hello world 🤔',
        isFavorite: true,
        // изначально делал editDate на случай редактирования сообщений, но саму эту фичу так и не сделал
        editDate: '2021-07-04T16:19:17.447Z',
      },
      {
        type: 'text',
        id: '2',
        date: '2021-07-04T15:07:17.447Z',
        content: 'Посмотрите на кота в шапке-лягушке!',
        isFavorite: true,
        attachments: {
          images: [
            {
              filename: 'кот_и_легушька.jpeg',
              src: 'images/photo_2021-07-22_13-04-51.jpg',
            },
          ],
        },
      },
      {
        type: 'text',
        id: '3',
        date: '2021-07-04T15:07:17.447Z',
        content: 'Картинки всякие разные',
        isFavorite: false,
        attachments: {
          images: [
            {
              filename: '0000.jpg',
              src: 'images/0000.jpg',
            },
            {
              filename: '0001.jpg',
              src: 'images/0001.jpg',
            },
            {
              filename: 'E5KorikVcAIQnGx.jpg',
              src: 'images/E5KorikVcAIQnGx.jpg',
            },
            {
              filename: 'SLoCgpBlHGc.jpg',
              src: 'images/SLoCgpBlHGc.jpg',
            },
          ],
        },
      },
      {
        type: 'text',
        id: '4',
        date: '2021-07-04T15:07:17.447Z',
        content: 'Видосики всякие разные',
        isFavorite: false,
        attachments: {
          video: [
            {
              filename: 'Ну, возможно_360p.mp4',
              src: 'video/Ну, возможно_360p.mp4',
            },
            {
              filename: 'BIG IRON_720p.mp4',
              src: 'video/BIG IRON_720p.mp4',
            },
            {
              filename: '02 (2)_360p.mp4',
              src: 'video/02 (2)_360p.mp4',
            },
          ],
        },
      },
      {
        type: 'sticker',
        id: '5',
        date: '2021-07-06T13:07:17.447Z',
        content: { pack: 'floppa', id: 2 },
        isFavorite: false,
      },
      {
        type: 'text',
        id: '6',
        date: '2021-08-04T15:07:17.447Z',
        content: 'dipi shmot',
        isFavorite: true,
        attachments: {
          audio: [
            {
              filename: '03 – Personal Jesus.mp3',
              src: 'audio/Personal Jesus.mp3',
            },
            {
              filename: '06 – Enjoy the Silence.mp3',
              src: 'audio/Enjoy the Silence.mp3',
            },
            {
              filename: '02 – The Things You Said.mp3',
              src: 'audio/The Things You Said.mp3',
            },
          ],
        },
      },
      {
        type: 'text',
        id: '7',
        date: '2021-07-06T17:07:17.447Z',
        content: 'Всякие разного типа файлы',
        isFavorite: false,
        attachments: {
          images: [
            {
              filename: '960f1qRGRlc.jpg',
              src: 'images/960f1qRGRlc.jpg',
            },
            {
              filename: 'JegqM5qE8wA.jpg',
              src: 'images/JegqM5qE8wA.jpg',
            },
          ],
          video: [
            {
              filename: 'b5dbcf487565.360.mp4',
              src: 'video/b5dbcf487565.360.mp4',
            },
          ],
          audio: [
            {
              filename: '05 – Lounge.mp3',
              src: 'audio/Lounge.mp3',
            },
          ],
        },
      },
      {
        type: 'files',
        id: '8',
        date: '2021-07-06T17:07:17.447Z',
        isFavorite: false,
        attachments: {
          images: [
            {
              filename: '0000.jpg',
              src: 'images/0000.jpg',
            },
            {
              filename: '0001.jpg',
              src: 'images/0001.jpg',
            },
            {
              filename: 'E5KorikVcAIQnGx.jpg',
              src: 'images/E5KorikVcAIQnGx.jpg',
            },
            {
              filename: 'SLoCgpBlHGc.jpg',
              src: 'images/SLoCgpBlHGc.jpg',
            },
          ],
        },
      },
      {
        type: 'text',
        content:
          'https://ru.wikipedia.org/wiki/%D0%93%D0%B8%D0%BF%D0%B5%D1%80%D1%81%D1%81%D1%8B%D0%BB%D0%BA%D0%B0',
        id: '9',
        date: '2021-07-17T17:07:17.447Z',
        isFavorite: false,
      },
      {
        type: 'text',
        content:
          'Всякие ссылочки (типа https://ru.wikipedia.org/wiki/JavaScript) вроде нормально парсятся и отображаются. Вот ещё ссылочки: https://ru.wikipedia.org/wiki/TypeScript, https://ru.wikipedia.org/wiki/%D0%AD%D0%B9%D1%85,_%D0%91%D1%80%D0%B5%D0%BD%D0%B4%D0%B0%D0%BD. Регулярку брал не готовую, а сделал свою, так что количество покрываемых случаев очень ограниченное.',
        id: '10',
        date: '2021-07-17T17:07:17.447Z',
        isFavorite: false,
      },
      {
        type: 'text',
        content: 'Одиннадцатое сообщение',
        id: '11',
        date: '2021-07-22T11:07:17.447Z',
        isFavorite: false,
      },
    ],
    // pinned: '1',
  },

  floppa: {
    messages: [
      {
        type: 'text',
        id: '1',
        date: '2021-07-04T15:07:17.447Z',
        content: 'Я Шлёпа, большой русский кот',
        isFavorite: true,
      },
    ],
  },
};
