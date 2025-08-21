const Admin = require('../model/Admin')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Utiliser une clé configurable en prod via process.env.JWT_SECRET
const JWT_SECRET = process.env.JWT_SECRET || 'RANDOM_SECRET_KEY';

exports.check = (req, res) =>{
    // Validation simple des inputs pour éviter les erreurs 500 côté serveur
    const email = req.body && req.body.email ? String(req.body.email).trim() : null;
    const pwd = req.body && req.body.pwd ? String(req.body.pwd) : null;

    if (!email || !pwd) {
        return res.status(400).json({ error: 'Email and password are required. email:'+email+' pwd:'+pwd });
    }

    Admin.findOne({email: email})
    .then((admin)=> {
        if(!admin){
            return res.status(401).json({ error: 'Incorrect email or password.' });
        }

        return bcrypt.compare(pwd, admin.pwd)
        .then((isValid)=>{
            if(!isValid){
                return res.status(401).json({ error: 'Incorrect email or password.' });
            }

            // Générer le token JWT
            const token = jwt.sign(
                { userId: admin._id },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            return res.status(200).json({ userId: admin._id, token });
        });
    })
    .catch((error)=> {
        // Retourner l'erreur serveur pour debug ; en prod on peut loguer et renvoyer un message générique
        console.error('Auth check error:', error);
        res.status(500).json({ error: error.message || error });
    })
}