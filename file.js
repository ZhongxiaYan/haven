const routes = require('express').Router();
const fs = require('fs');
const multer = require('multer');
const path = require('path');

const fileRoot = path.join(__dirname, 'files');
const propertyRoot = path.join(fileRoot, 'properties');
const tmpRoot = path.join(__dirname, 'tmp');

const upload = multer({ dest: tmpRoot });

routes.get('/:propertyId/video/:videoName', (req, res) => {
  let { propertyId, videoName } = req.params;
  let vPath = path.join(propertyRoot, propertyId, 'video', videoName);
  const fileSize = fs.statSync(vPath).size;
  const range = req.headers.range;
  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = (end - start) + 1;
    const file = fs.createReadStream(vPath, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4'
    }
    res.writeHead(200, head);
    fs.createReadStream(vPath).pipe(res);
  }
});

routes.get('/:propertyId/photos/:photoName', (req, res) => {
  let { propertyId, photoName } = req.params;
  let pPath = path.join(propertyRoot, propertyId, 'photos', photoName);
  res.sendFile(pPath);
});


function addMimeTypeToFilename(fileAttrs) {
  fileAttrs.forEach(fileAttr => {
    let { originalname, filename } = fileAttr;
    fileAttr.filename = `${filename}.${originalname.split('.').pop()}`;
  });
}

function saveFilesForProperty(propertyId, fileAttrs, type) {
  let fileDir = path.join(propertyRoot, propertyId, type);
  fs.mkdirSync(fileDir, { recursive: true });
  fileAttrs.forEach((fileAttr) => {
    let newPath = path.join(fileDir, fileAttr.filename);
    fs.rename(fileAttr.path, newPath, err => {
      if (err) throw err;
    });
  });
}

function deleteFiles(fileAttrs) {
  fileAttrs.forEach(({ path }) => {
    fs.unlink(path, err => {
      if (err) {
        throw err;
      }
    });
  });
}

module.exports = { routes, upload, addMimeTypeToFilename, saveFilesForProperty, deleteFiles };
