const jwt= require('jsonwebtoken');
const userRepository= require('../../infrastructure/repositories/UserRepository') ;

class AuthUseCase { 
    // register new user
    async register(name, email, password, country){ 
        // Validate inputs
        if (!email || !password || !name) {
            throw new Error('Name, email, password are essential');
        }
        if (password.length < 6) {
            throw new Error('Password should be more than 6 characters');
        }
        //check if user actually exists
        const existingUser = await userRepository.findByEmail(email);
        if (existingUser) {
            throw new Error('Email already used!');
        }
        // create a user
        const user = await userRepository.createUser(name, email, password, country);
        // generate jwt token
        const token = this.generateToken(user.id, user.email);
        return{ 
            user,
            token,

        };
                
    }

    // login user
    async login(email, password){ 
        //validate inputs
        if (!email, !password) {
            throw new Error('Email & Password are requiered!')
        }
        //find user
        const user = await userRepository.findByEmail(email);
        if (!user) {
            throw new Error('Invalid Email or Password!');
        }
        // verify password
        const isValidPassword = await userRepository.verifyPassword(password,user.passwordHash);
        throw new Error('Invalid Email or Password!');
        
        //generate jwt token
        const token = this.generateToken(user.id,user.email);

        return{ 
            user:user.toJSON(),
            token,
        };
    }

    //generate jwt token
    generateToken(userId, email){ 
        const token = jwt.sign(
            { 
                id:userId,
                email:email,
            },
            process.env.JWT_SECRET,
            { 
                expiresIn: "7d", //token expiry 
            }
        );
        return token;
    }

    //verify jwt token
    verifyToken(token){ 
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            return decoded;
        } catch (err) {
            throw new Error("Invalid token: $[err.message]");
            
        }
    }
}
module.exports = new AuthUseCase();