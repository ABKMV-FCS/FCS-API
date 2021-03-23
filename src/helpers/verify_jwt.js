const jwt=require('jsonwebtoken');
const config=require('../../config.json');
module.exports=(req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, config.jwt_secret, (err, tokenDetails) => {
            if (err) {
                return res.status(403).json({message:'Unauthorized'});
            }
            req.tokenDetails = tokenDetails;
            next();
        });
    } else {
        res.status(401).json({message:'Unauthorized'});
    }
};