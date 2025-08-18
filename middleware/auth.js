const jwt = require('jsonwebtoken');

exports.checkAuth = (req, res, next)=>{
    try{
        const token = req.headers.authorization.split(' ')[1];
        const decodedValue = jwt.verify(token, 'RANDOM_SECRET_KEY');
        const userId = decodedValue.urserId;

        req.auth = {
            userId: userId
        }
        next()
    }catch(e){
        res.status(401).json({data: 'Non autorisé.'})
    }
}
