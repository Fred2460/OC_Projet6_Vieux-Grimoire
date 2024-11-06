const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const sharp = require('../middleware/sharp');

const bookCtrl = require('../controllers/book');

router.get('/', bookCtrl.getAllBook);
// router.get('/bestrating', bookCtrl.getBestBook); //= récupération des 3 livres avec les meilleurs ratings (***** A CONSTRUIRE *****)
router.get('/:id', bookCtrl.getOneBook);
router.post('/', auth, multer, bookCtrl.createBook);
//router.post('/', auth, multer, sharp, bookCtrl.createBook);
router.post('/:id/rating', auth, bookCtrl.rateBook); // Rating d'un livre par un user (***** A CONSTRUIRE *****)
router.put('/:id', auth, multer, bookCtrl.modifyBook);
router.delete('/:id', auth, bookCtrl.deleteBook);

module.exports = router;
