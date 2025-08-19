const Admin = require('../model/Admin')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.check = (req, res) =>{
    const email = req.body.email.trim();

    Admin.findOne({email: email})
    .then((admin)=> {
        if(admin === null){
            res.status(401).json({data: 'Incorrect email or password !'})
            return;
        }
        bcrypt.compare(req.body.pwd, admin.pwd)
        .then((isValid)=>{
            if(!isValid){
                console.log('me ')
                res.status(401).json({data: 'Incorrect email or password !'})
                return;
            }else{
                res.status(200).json({
                    userId: admin._id,
                    token: jwt.sign(
                        {userId: admin._id},
                        'RANDOM_SECRET_KEY',
                        {expiresIn: '24h'}
                    )
                })
            }
        })
        .catch((error) => res.status(500).json({error}))
    })
    .catch((error)=> res.status(403).json({error}))
}