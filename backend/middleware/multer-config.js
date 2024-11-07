const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    const newFilename = name + Date.now() + '.' + extension;
    callback(null, newFilename);
  }
});

const upload = multer({ storage: storage }).single('image');

const resizeImage = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const filepath = path.join('images', req.file.filename);
  const resizedFilepath = path.join('images', 'resized_' + req.file.filename);

  sharp(filepath)
    .resize({ width: 463 })
    .toFile(resizedFilepath)
    .then(() => {
      // Supprimez l'image originale après le redimensionnement
      // Mettre à jour le chemin de fichier pour utiliser le fichier redimensionné
      req.file.path = resizedFilepath;
      console.log('req.file.path =', req.file.path);
      req.file.filename = 'resized_' + req.file.filename;
      console.log('req.file.filename =', req.file.filename);
      
      const readStream = fs.createReadStream(filepath);
      readStream.on('close', () => {
        fs.unlink(filepath, (error) => {
          if (error) {
            console.error('Erreur lors de la suppression de l\'image d\'origine :', error);
          }
        });
      });
      readStream.close();
      next()
    })
      //req.file.resizedPath = resizedFilepath; // Optionnel, pour usage futur
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'Erreur lors du redimensionnement de l\'image' });
    });
};

module.exports = { upload, resizeImage };
