const multer = require('multer');
const sharp = require('sharp');

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

//const newFilename = 
//const sharpImage = sharp(newFilename).resize(({ width: 463 })).toFile(newFilenamecomp);


module.exports = multer({storage: storage}).single('image');
