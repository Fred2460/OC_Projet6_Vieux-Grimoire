const Book = require('../models/book');

const fs = require('fs');

exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;
  const book = new Book({
      ...bookObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  book.save()
    .then (() => { res.status(201).json({message: 'Livre enregistré !'}) })
    .catch ((error) => { res.status(400).json({error: error}) });
};


exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then ((book) => { res.status(200).json(book) })
    .catch ((error) => { res.status(404).json({error: error}) })
};


exports.modifyBook = (req, res, next) => {
  const bookObject = req.file ? {
    ...JSON.parse(req.body.book),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };
  delete bookObject._userId;
  Book.findOne({ _id: req.params.id })
    .then ((book) => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message : 'Non autorisé'});
      } else {
        const filenameOld = book.imageUrl.split('/images/')[1];
        console.log('filenameOld 39ctrl.book=', filenameOld); //vérif
        fs.unlink(`images/${filenameOld}`, () => {
          Book.updateOne({_id: req.params.id}, {...bookObject, _id: req.params.id})
          .then (() => { res.status(201).json({message: 'Livre modifié !'}) })
          .catch ((error) => { res.status(400).json({error: error}) });
        })
      }
    })
    .catch ((error) => {
      res.status(400).json({error});
    });
};


exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then ((book) => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({message: 'Non autorisé'});
      } else {
        const filename = book.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Book.deleteOne({_id: req.params.id})
          .then (() => { res.status(200).json({message: 'Livre supprimé !'}) })
          .catch ((error) => { res.status(400).json({error: error}) })
        });
      }
    })
    .catch ((error) => {
        res.status(500).json({ error });
    });
};


exports.getAllBook = (req, res, next) => {
  Book.find()
    .then ((books) => { res.status(200).json(books) })
    .catch ((error) => { res.status(400).json({error: error}) })
};

exports.rateBook = (req, res, next) => {
  const { rating } = req.body; // récupération de la note donnée par le user connecté
  Book.findOne({ _id: req.params.id })
  .then ((book) => {
    if (!book) {
      return res.status(404).json({ message: 'Livre non trouvé' });
    }
    if (book.userId === req.auth.userId) {
      res.status(401).json({message: 'Non autorisé'});
    } else {
      const oldRater = book.ratings.find(rating => rating.userId === req.auth.userId)
      console.log('oldRater 97=', oldRater); // vérif
      if (oldRater != "undefined") {
        // Ajout de la nouvelle note
        const newRatings = [...book.ratings, { userId: req.auth.userId, grade:rating }];
        // Calcul de la nouvelle note moyenne
        const newAverageRating = parseFloat((newRatings.reduce((sum, rating) => sum + rating.grade, 0) / newRatings.length).toFixed(1));
        // Mise à jour du document book
        Book.updateOne({ _id: req.params.id }, { ratings: newRatings, averageRating: newAverageRating })
          .then (() => { 
            res.status(200).json({message: 'Livre noté !'})
          })
          .catch ((error) => { res.status(400).json({error: error}) })
      } else {
        res.status(401).json({ message : 'Non autorisé'});
      }
    }
  })
  .catch ((error) => { res.status(404).json({error: error}) })
}
