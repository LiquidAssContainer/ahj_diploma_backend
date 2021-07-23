const http = require('http');
const path = require('path');
const fs = require('fs');
const Koa = require('koa');
const koaBody = require('koa-body');
const serve = require('koa-static');
const Router = require('koa-router');
const cors = require('koa-cors');

const ChaosOrganizer = require('./Organizer');
const users = require('./users');

const app = new Koa();
const router = new Router();

const publicDirPath = path.join(__dirname, '/public');

app.use(
  cors({
    origin: '*',
  }),
);

app.use(
  koaBody({
    text: true,
    urlencoded: true,
    multipart: true,
    json: true,
  }),
);

const organizer = new ChaosOrganizer(users);

const handleRequest = async (ctx, handler) => {
  try {
    await handler();
  } catch ({ message, status }) {
    ctx.body = message;
    ctx.status = status || 500;
  }
};

router
  .get('/:user/messages', async (ctx, next) => {
    const { user } = ctx.params;
    const { before } = ctx.query;
    if (before) {
      ctx.body = organizer.getMessagesBeforeMsgId(user, before);
    } else {
      ctx.body = organizer.getRecentMessages(user);
    }
    return await next();
  })

  .post('/:user/messages', async (ctx, next) => {
    const { user } = ctx.params;
    const {
      body: message,
      files: { files },
    } = ctx.request;

    await handleRequest(ctx, async () => {
      const newMessage = await organizer.addMessage(user, message, files);
      ctx.body = newMessage;
    });
    return await next();
  })

  .get('/:user/messages/search', async (ctx, next) => {
    const { user } = ctx.params;
    const { q: query } = ctx.request.query;

    if (query) {
      handleRequest(ctx, () => {
        ctx.body = organizer.searchByString(user, query);
      });
    }
    return await next();
  })

  .del('/:user/messages/:id', async (ctx, next) => {
    const { user, id } = ctx.params;

    handleRequest(ctx, () => {
      organizer.removeMessage(user, id);
      ctx.status = 204;
    });
    return await next();
  })

  .get('/:user/favorites', async (ctx, next) => {
    const { user } = ctx.params;
    const { before } = ctx.request.query;

    handleRequest(ctx, () => {
      if (before) {
        ctx.body = organizer.getMessagesBeforeMsgId(user, before, 'favorite');
      } else {
        ctx.body = organizer.getRecentFavorites(user);
      }
    });
    return await next();
  })

  .post('/:user/favorites/:id', async (ctx, next) => {
    const { user, id } = ctx.params;

    handleRequest(ctx, () => {
      organizer.addToFavorites(user, id);
      ctx.status = 204;
    });
    return await next();
  })

  .del('/:user/favorites/:id', async (ctx, next) => {
    const { user, id } = ctx.params;

    handleRequest(ctx, () => {
      organizer.removeFromFavorites(user, id);
      ctx.status = 204;
    });
    return await next();
  })

  .get('/:user/:media', async (ctx, next) => {
    const { user, media } = ctx.params;
    const { before } = ctx.request.query;
    const mediaTypes = ['audio', 'images', 'video'];
    if (!mediaTypes.includes(media)) {
      return await next();
    }
    await handleRequest(ctx, async () => {
      if (before) {
        ctx.body = organizer.getMessagesBeforeMsgId(user, before, media);
      } else {
        ctx.body = organizer.getRecentMedia(user, media);
      }
    });
    return await next();
  })

  .get('/stickers', async (ctx, next) => {
    // много кода и костыльно, но я плохо знаю fs...
    const stickersDirPath = path.join(__dirname, '/public/stickers');
    const stickerPacks = [];
    fs.readdir(stickersDirPath, (err, dirs) => {
      for (const dir of dirs) {
        const stickerPack = { pack: dir, stickers: [] };
        fs.readdir(stickersDirPath + '/' + dir, (err, files) => {
          if (err) {
            return;
          }
          for (const file of files) {
            const src = `stickers/${dir}/${file}`;
            const id = file.split('.')[0];
            stickerPack.stickers.push({ src, id });
          }
          stickerPack.preview = stickerPack.stickers[0].src;
          stickerPacks.push(stickerPack);
        });
      }
    });
    ctx.body = stickerPacks;
    return await next();
  });

app.use(router.routes()).use(router.allowedMethods());
app.use(serve(publicDirPath));

const port = process.env.PORT || 7070;
http.createServer(app.callback()).listen(port);
