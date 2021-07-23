const uuid = require('uuid');
const path = require('path');
const fs = require('fs');

module.exports = function writeFileAndGetLink(file) {
  // основано на функции из какого-то давнего примера в презентации, местами без изменений
  return new Promise((resolve, reject) => {
    const allowedExtensions = {
      image: ['jpeg', 'png', 'gif'],
      video: ['mp4', 'quicktime', 'webm'],
      audio: ['mpeg', 'flac'],
    };
    const outputDirs = {
      image: 'images',
      video: 'video',
      audio: 'audio',
    };

    if (!file.type) {
      throw new Error('Отсутствуют данные о типе файла');
    }

    const [type, extension] = file.type.split('/');

    if (!allowedExtensions[type]) {
      throw new Error(`Тип файла ${type} не поддерживается`);
    }

    if (!allowedExtensions[type].includes(extension)) {
      throw new Error(`Тип файла ${extension} не поддерживается`);
    }

    const publicDirPath = path.join(__dirname, '/public');
    const outputDirPath = path.join(publicDirPath, `/${outputDirs[type]}`);

    const oldPath = file.path;

    const { name } = file;
    const nameArr = name.split('.');
    const fileExtension = nameArr[nameArr.length - 1];
    if (fileExtension === name) {
      throw new Error('Вообще что-то странное пошло');
    }

    const filename = `${uuid.v4()}.${fileExtension}`;
    const newPath = path.join(outputDirPath, filename);

    const callback = (error) => reject(error);

    const readStream = fs.createReadStream(oldPath);
    const writeStream = fs.createWriteStream(newPath);

    readStream.on('error', callback);
    writeStream.on('error', callback);

    readStream.on('close', () => {
      fs.unlink(oldPath, callback);
      const fileType = outputDirs[type];
      resolve({
        filename: file.name,
        src: `${fileType}/${filename}`,
        type: fileType,
      });
    });

    readStream.pipe(writeStream);
  });
};
