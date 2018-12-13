import jwt from 'jsonwebtoken';

const VerifyToken = (req, res, next) => {
    const key = process.env.SECRET_KEY || 'brillianceisevenlydistributed';
    const bearerHeader = req.body.token || req.headers.authorization;

    if (!bearerHeader) {
        res.status(401).send({
            message: 'Unauthorized user',
        });
    } else if (typeof bearerHeader !== 'undefined') {
        jwt.verify(bearerHeader, key, (err, authData) => {
            if (err) {
                res.status(403).send({
                    message: 'Forbidden access',
                });
            }
            req.token = authData;
            next();
        });
    }
};

export default VerifyToken;
