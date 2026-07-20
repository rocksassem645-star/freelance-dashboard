const jwt = require("jsonwebtoken");
const userRepository = require("../../infrastructure/repositories/UserRepository");

class AuthUseCase {
  // Validate password strength
  validatePassword(password) {
    const errors = [];

    if (password.length < 12) {
      errors.push("Password must be at least 12 characters");
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    
    if (!/[0-9]/.test(password)) {
      errors.push("Password must contain at least one number");
    }
    
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push("Password must contain at least one special character");
    }

    // Check against common passwords
    const commonPasswords = [
      'password', 'qwerty', '123456', 'letmein', 'admin', 'welcome', 
      'monkey', '1q2w3e4r', 'abc123', 'password123'
    ];
    
    if (commonPasswords.includes(password.toLowerCase())) {
      errors.push("Password is too common");
    }

    if (errors.length > 0) {
      throw new Error(errors.join('; '));
    }

    return true;
  }

  // register new user
  async register(name, email, password, country) {
    // Validate inputs
    if (!email || !password || !name) {
      throw new Error("Name, email, password are essential");
    }

    // Validate password strength FIRST
    this.validatePassword(password);

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }

    // Check if user exists (don't reveal this in response for security)
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      // Return generic message for security
      throw new Error("If email already registered, check your inbox");
    }

    // Create user with stronger bcrypt rounds
    const user = await userRepository.createUser(
      name,
      email,
      password,
      country,
    );

    // Generate token pair (access + refresh)
    const tokens = this.generateTokenPair(user.id, user.email);
    
    return {
      user,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,  // Return to client for storage
    };
  }

  // login user
  async login(email, password) {
    if (!email || !password) {
      throw new Error("Email & Password are required!");
    }

    const user = await userRepository.findByEmail(email);

    if (!user) {
      // Generic error message - don't reveal if email exists
      throw new Error("Invalid Email or Password!");
    }

    // Check if account is locked
    if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
      throw new Error("Account temporarily locked due to too many failed attempts");
    }

    // Verify password WITHOUT logging it
    const isValidPassword = await userRepository.verifyPassword(
      password,
      user.passwordHash,
    );

    if (!isValidPassword) {
      // Record failed attempt
      await userRepository.recordFailedLogin(user.id);
      
      // Generic error message
      throw new Error("Invalid Email or Password!");
    }

    // Clear failed attempts on successful login
    await userRepository.recordSuccessfulLogin(user.id);

    // Generate token pair
    const tokens = this.generateTokenPair(user.id, user.email);
    
    return {
      user: user.toJSON(),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  // Generate JWT access token (short-lived)
  generateToken(userId, email) {
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
      throw new Error("JWT_SECRET not properly configured");
    }

    const token = jwt.sign(
      {
        id: userId,
        email: email,
        type: 'access'  // Differentiate from refresh tokens
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",  // Short-lived access token
        issuer: "myapp",
        audience: "myapp-client"
      },
    );
    
    return token;
  }

  // Generate refresh token (long-lived)
  generateRefreshToken(userId) {
    if (!process.env.REFRESH_TOKEN_SECRET || process.env.REFRESH_TOKEN_SECRET.length < 32) {
      throw new Error("REFRESH_TOKEN_SECRET not properly configured");
    }

    const token = jwt.sign(
      {
        id: userId,
        type: 'refresh'
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "7d",
        issuer: "myapp",
        audience: "myapp-client"
      },
    );
    
    return token;
  }

  // Generate token pair
  generateTokenPair(userId, email) {
    return {
      accessToken: this.generateToken(userId, email),
      refreshToken: this.generateRefreshToken(userId)
    };
  }

  // Verify JWT token
  verifyToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET, {
        issuer: "myapp",
        audience: "myapp-client"
      });
      
      if (decoded.type !== 'access') {
        throw new Error("Invalid token type");
      }
      
      return decoded;
    } catch (err) {
      throw new Error(`Invalid token: ${err.message}`);
    }
  }

  // Verify refresh token
  verifyRefreshToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, {
        issuer: "myapp",
        audience: "myapp-client"
      });
      
      if (decoded.type !== 'refresh') {
        throw new Error("Invalid token type");
      }
      
      return decoded;
    } catch (err) {
      throw new Error(`Invalid refresh token: ${err.message}`);
    }
  }
}

module.exports = new AuthUseCase();