const multer = require('multer');
const path = require('path');

const MIME_TYPE = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg', 
    'image/png': 'png'
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        // Nettoyer le nom original du fichier
        let name = file.originalname.split('.')[0]; // Enlever l'extension
        name = name.split(' ').join('-'); // Remplacer espaces par tirets
        
        // Ajouter timestamp et extension
        const extension = MIME_TYPE[file.mimetype];
        const finalName = `${name}-${Date.now()}.${extension}`;
        cb(null, finalName);
    }
});

// Configuration multer avec validation
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        // Vérifier le type MIME
        if (MIME_TYPE[file.mimetype]) {
            cb(null, true);
        } else {
            cb(new Error('Type de fichier non supporté. Utilisez JPG, JPEG ou PNG.'), false);
        }
    }
});

// Exporter un middleware qui tolère l'absence de fichier (image optionnelle)
const singleUpload = upload.single('image');

module.exports = (req, res, next) => {
    singleUpload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // erreurs liées à multer (ex: limit)
            return res.status(400).json({ error: err.message });
        } else if (err) {
            // Erreurs personnalisées (type MIME, etc.)
            return res.status(400).json({ error: err.message });
        }
        // Pas de fichier est accepté ; continuer
        next();
    });
};