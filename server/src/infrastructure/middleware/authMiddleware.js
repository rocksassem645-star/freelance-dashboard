const { verify } = require("jsonwebtoken");
const authUseCase = require("../../application/usecases/AuthUseCase");

// middleware to verify jwt tokens
const authMiddleWare = (req, res, next) =>{ 
    try {
        // get token from authorization header
        const authHeader = req.headers['authorization'];

     if (!authHeader) { 
         return res.status(401).json({error:'No token provided'});
     }   

    //extract token: (format: token "bearer_here")
    const token = authHeader.startsWith('bearer')
    ? authHeader.slice(7)
    : authHeader;

    // verify token
    const decoded = authUseCase.verifyToken(token);

    // attach user info to request
    req.user = decoded;
    next();

          } catch(err){ 
            return res.status(401).json({error:"Invalid or expired token"})
          }
        };

        module.exports = authMiddleWare;