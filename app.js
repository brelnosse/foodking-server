 require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const recipe = require('./route/recipe');
const auth = require('./route/auth')
const path = require('path');
const fs = require('fs');

mongoose.connect('mongodb+srv://brelnosse2:'+process.env.MONGODB_KEY+'@cluster0.xqtedmz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
.then(()=> console.log('Connexion réussi !!'))
.catch(()=> console.log('Connexion échoué !!'))
// Créer le dossier images s'il n'existe pas
const imagesDir = path.join(__dirname, 'images');
try {
    if (!fs.existsSync(imagesDir)) {
        fs.mkdirSync(imagesDir, { recursive: true });
        // console.log('Dossier images créé avec succès');
    } else {
        // console.log(process.env);
    }
} catch (error) {
    console.error('Erreur lors de la création du dossier images:', error.message);
    process.exit(1); // Arrêter l'application si le dossier ne peut pas être créé
}

app.use('/images', express.static(imagesDir));
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, Content, Content-Type, Authorization, X-Requested-With'); // Corrigé la typo
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, PUT, PATCH, POST, GET, DELETE');    
    
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
        return;
    }
    next();
});
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Bienvenue sur l\'API FoodKing',
        description: 'API de gestion de recettes de cuisine',
        endpoints: {
            recipes: {
                POST: '/api/create - Créer une nouvelle recette',
                GET_1: '/api/recipes - Obtenir toutes les recettes',
                GET_2: '/api/recipes/categories - Obtenir les catégories des recettes',
                GET_3: '/api/recipes/categories/:name - Filtrer les recettes par catégorie',
                GET_4: '/api/recipes/search/:name - Rechercher une recette par son nom',
                GET_5: '/api/recipes/:id - Obtenir une recette spécifique',
                GET_6: '/api/recipes/like/:id - Ajoute un like pour une recette précise',
                GET_7: '/api/recipes/likes/all - Obtenir toutes les recettes avec leur likes',
            },
            auth: {
                POST: '/api/check - Se connecter en admin'
            }
        },
        version: '1.0.0'
    });
});
app.use('/api', recipe);
app.use('/api/auth', auth);
module.exports = app;
