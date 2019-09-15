const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
// const config = require('config');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator/check');

// @route  GET api/auth
// @desc   Test route
// @access Public
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch(err) {
    res.status(500).send('Server Error');
  }
});

// @route  Post api/auth
// @desc   Authenticate user & get token
// @access Public
router.post('/', [
  check('email', 'Please include a valid email')
  .isEmail(),
  check('password', 'Password is required')
  .exists()
],
async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) { // if there are errors
    return res.status(400).json({ errors: errors.array() })
  }

  const { email, password } = req.body;

  try {
    // See if the user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] }); // matches express-validator error
    }
    // Compare plaintext password with MongoDB encrypted password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
    }
    // Return jsonwebtoken
    const payload = {
      user: {
        id: user.id // mongoose ignores the underscore in mongodb
      }
    }
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw error;
        res.json({ token });
      }
    )
  } catch(err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;