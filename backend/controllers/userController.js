const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const createToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('Login attempt for email:', email);

    if (!email || !password) {
      console.log('Login failed: Email or password missing');
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log('Login failed: User not found');
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('Login failed: Incorrect password');
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = createToken(user._id);

    console.log('Login successful for user:', user._id);

    res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

const signupUser = async (req, res) => {
  const { email, password, name, role } = req.body;

  try {
    console.log('Signup attempt for email:', email);

    if (!email || !password || !name) {
      console.log('Signup failed: Missing required fields');
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('Signup failed: Email already in use');
      return res.status(400).json({ error: 'Email already in use' });
    }

    const user = new User({ email, password, name, role: role || 'user' });
    await user.save();

    const token = createToken(user._id);

    console.log('Signup successful for user:', user._id);

    res.status(201).json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

module.exports = { loginUser, signupUser };