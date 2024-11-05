const express = require('express');

const userRoutes = require('./routes/user');
const bookRoutes = require('./routes/book');

//const path = require('path');

const bodyParser = require('body-parser');
const mongoose = require('mongoose');
//require('dotenv').config()

const app = express();

mongoose.connect('mongodb+srv://fredweb24:Ukqni2s2ec4pPJl9@go-fullstack.q9cre.mongodb.net/vieuxGrimoire?retryWrites=true&w=majority',
    //{ useNewUrlParser: true,
    //  useUnifiedTopology: true }
    )
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch((error) => console.log('Connexion à MongoDB échouée :', error));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());

app.use('/api/auth', userRoutes);
app.use('/api/books', bookRoutes);

//app.use('/images', express.static(path.join(__dirname, 'images')));


module.exports = app;
