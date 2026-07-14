const express = require("express");
const authUseCase = require("../application/usecases/AuthUseCase");
const authMiddleware = require("../infrastructure/middleware/authMiddleware");

const router = express.Router();

// register endpoint
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, country } = req.body;
    const result = await authUseCase.register(name, email, password, country);

    res.status(201).json({
      message: "Registeration successful",
      user: result.user,
      token: result.token,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// login endpoint
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await authUseCase.login(email, password);

    res.status(200).json({
      message: "Login successful",
      user: result.user,
      token: result.token,
    });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

//get current user endpoint
router.get("/me", authMiddleware, async (res, req) => {
  try {
    const userRepository = require("../infrastructure/repositories/UserRepository");
    const user = await userRepository.findById(req.user.id);

    if (!user) {
        return res.status(404).json({error:'User not found'});
    }
    res.status(200).json({ 
        user: user.toJSON(),
    });
  } catch (err) { 
    res.status(500).json({error: err.message});
  }
});

module.exports = router;
