const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const bookCtrl = require('../controllers/book');

// router.get('/', bookCtrl.getAllBook); // initial
router.get('/api/books', bookCtrl.getAllBook);
router.get('/:id', bookCtrl.getOneBook);
// router.get('/bestrating', bookCtrl.getBestBook); //= récupération des 3 livres avec les meilleurs ratings
router.post('/', auth, multer, bookCtrl.createBook);
router.put('/:id', auth, multer, bookCtrl.modifyBook);
router.delete('/:id', auth, bookCtrl.deleteBook);
// router.post('/:id/rating', auth, multer, bookCtrl.rateBook); // Rating d'un livre par un user

module.exports = router;
