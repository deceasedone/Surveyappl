const express = require('express');
const { signupUser, loginUser } = require('../controllers/userController');

const router = express.Router();

router.post('/signup', signupUser);
router.post('/login', loginUser);

console.log('User routes registered:', router.stack.map(r => r.route.path));

module.exports = router;