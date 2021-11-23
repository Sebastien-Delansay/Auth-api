const jwt = require('jsonwebtoken');
const JWT_SIGN_SECRET = 'vd1vqvfd4s51vfd5vfds5vdc552vcds7gfe97gdfsvfsd449lkjhuh97azerds';

module.exports = {
    generateTokenForUser: function(userData){
        return jwt.sign({
            userId: userData.id
        },
        JWT_SIGN_SECRET,{
            expiresIn: '1h'
        })
    },

    parseAuthorization: function(authorization){
        return (authorization != null) ? authorization.replace('Bearer ', ''): null;
    },

    getUserId: function(authorization){
        let userId = -1;
        const token = module.exports.parseAuthorization(authorization);

        if(token != null){
            try{
                let jwtToken = jwt.verify(token, JWT_SIGN_SECRET);
                if(jwtToken != null){
                    userId = jwtToken.userId;
                }

            }catch(err){ }
        }
        return userId;
    }
}