const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator/check');
const jwt = require('jsonwebtoken');
const config = require('config');

// @route  Post api/users
// @desc   Register user
// @access Public
router.post('/', [
  check('name', 'Name is required')
  .not()
  .isEmpty() ,
  check('email', 'Please include a valid email')
  .isEmail(),
  check('password', 'Please enter a password with 6 or more characters')
  .isLength({ min: 6 })
],
async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) { // if there are errors
    return res.status(400).json({ errors: errors.array() })
  }

  const { name, email, password } = req.body;

  try {
    // See if the user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ errors: [ { msg: 'User already exists' } ] }) // matches express-validator error
    }
    // Get users gravatar
    const avatar = gravatar.url(email, {
      s: '200',
      r: 'pg',
      d: 'mm'
    });
    // Create instance of user
    user = new User({
      name,
      email,
      avatar,
      password
    });
    // Encrypt password with bcryptjs
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    // Save user into database
    await user.save()
    // Return jsonwebtoken
    const payload = {
      user: {
        id: user.id // mongoose ignores the underscore in mongodb
      }
    }
    jwt.sign(
      payload,
      config.get('jwtSecret'),
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