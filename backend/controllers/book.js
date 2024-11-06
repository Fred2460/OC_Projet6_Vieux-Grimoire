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

// exports.modifyBook d'origine ********** => OK 

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
  const bookObject = { ...req.body };
  console.log('bookObject initial 125=', bookObject); // vérif

  Book.findOne({ _id: req.params.id })
  .then ((book) => {
    console.log('book initial 129=', book); // vérif
    //if (book.userId === req.auth.userId) {
    if (book.userId != book.userId) { // test bidon
      res.status(401).json({message: 'Non autorisé'});
    } else {
      console.log('vérif 134');
      const oldRater = book.ratings.find(oldRater => book.ratings.userId === req.auth.userId)
      console.log('oldRater 135=', oldRater); // vérif
      //if (oldRater === undefined) {
      if (1 === 1) { // test bidon
        //const newRating = { bookObject.userId}, {bookObject.grade };
        //const oldRatings = book.ratings;
        let newRatings = [...book.ratings]
        delete newRatings._id;
        console.log('newRatings 142=', newRatings);

        newRatings.push({ userId: req.auth.userId, grade: rating });
        //book.ratings.push(bookObject.userId, bookObject.grade);
        console.log('newRatings 145=', newRatings);
        console.log('bookObject après 142=', bookObject); // vérif
        console.log('book.rating après 143=', book.ratings); // vérif
        console.log('book après 144=', book); // vérif
        Book.updateOne({_id: req.params.id}, {ratings: newRatings})
        //Book.save()
          .then (() => { 
            res.status(200).json({message: 'Livre noté !'}), 
            console.log('book noté 145=', book); // vérif
          })
          .catch ((error) => { res.status(400).json({error: error}) })
      } else {
        res.status(401).json({ message : 'Non autorisé'});
      }
    }
  })
  .catch ((error) => { res.status(404).json({error: error}) })
}
