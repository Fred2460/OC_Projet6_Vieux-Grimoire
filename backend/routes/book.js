const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const bookCtrl = require('../controllers/book');

router.get('/', bookCtrl.getAllBook);
// router.get('/bestrating', bookCtrl.getBestBook); //= récupération des 3 livres avec les meilleurs ratings (***** A COSTRUIRE *****)
router.get('/:id', bookCtrl.getOneBook);
router.post('/', auth, multer, bookCtrl.createBook);
// router.post('/:id/rating', auth, multer, bookCtrl.rateBook); // Rating d'un livre par un user (***** A COSTRUIRE *****)
router.put('/:id', auth, multer, bookCtrl.modifyBook);
router.delete('/:id', auth, bookCtrl.deleteBook);

module.exports = router;
