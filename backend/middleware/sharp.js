const sharp = require('sharp');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

module.exports = async (req, res, next) => {
    const { buffer } = req.file;
    const extension = MIME_TYPES[req.file.mimetype]
    console.log('buffer=', buffer);
    console.log('req.file avant=', req.file);
    console.log('extension=', extension);

    if (!extension) {
        return res.status(400).json({ message: 'Format non pris en charge'});
    }

    try {
        const processedImage = sharp(buffer).resize({ width: 463 });
        //const processedImage = sharp(req.file).resize({ width: 463 });
        //console.log('req.file après=', req.file);
        //console.log('processedImage avant=', processedImage);
        if (extension === 'jpg' || extension === 'jpeg') {
            processedImage = processedImage.jpeg({ quality: 80})
        } else if (extension === 'png') {
            processedImage = processedImage.png({ quality: 80, compressionLevel: 7 })
        } else {
          throw new Error('Format non pris en charge');
        }
        req.file.buffer = await processedImage.toBuffer();
        console.log('processedImage après=', processedImage);
        next();
    } catch(error) {
        res.status(401).json({ error });
    }
 };
