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

module.exports = upload.single('image');