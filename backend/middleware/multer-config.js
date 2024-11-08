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
      // Mettre à jour le chemin de fichier pour utiliser le fichier redimensionné
      req.file.path = resizedFilepath;
      req.file.filename = 'resized_' + req.file.filename;

      // Supprimez l'image originale après le redimensionnement
      /*
      console.log('filepath 51multer=', filepath) // vérif
      setTimeout(() => {
        console.log('filepath 53multer=', filepath) // vérif
        fs.unlink(filepath, (error) => {
          if (error) {
            console.error('Erreur lors de la suppression de l\'image d\'origine :', error);
          }
        });
      }, 200);
      */
      next()
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'Erreur lors du redimensionnement de l\'image' });
    });
};

module.exports = { upload, resizeImage };
