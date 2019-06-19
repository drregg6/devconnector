const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const auth = require('../../middleware/auth');

const Post = require('../../models/Post');
const User = require('../../models/User');
const Profile = require('../../models/Profile');

// @route  POST api/posts
// @desc   Create a post
// @access Private
router.post('/', [ auth, [
  check('text', 'Text field required')
  .not()
  .isEmpty()
] ], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    // grab the entire user object
    // { _id, name, email, avatar }
    const user = await User.findById(req.user.id).select('-password');

    // create new post using user.name and user.avatar
    const newPost = new Post({
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
      user: req.user.id
    });

    // save and return post
    const post = await newPost.save();
    res.json(post);
  } catch (e) {
    console.error(e.message);
    res.status(500).send('Server error');
  }
});

// @route  GET api/posts
// @desc   Get all posts
// @access Private
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 }); // most recent date
    res.json(posts);
  } catch (e) {
    console.error(e.message);
    res.status(500).send('Server error');
  }
});

// @route  GET api/posts/:id
// @desc   Get post by ID
// @access Private
router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById( req.params.id );

    if (!post) {
      return res.status(404).json({ msg: 'No post found' })
    }

    res.json(post);
  } catch (e) {
    if (e.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' })
    }
    console.error(e.message);
    res.status(500).send('Server error');
  }
});

// @route  DELETE api/posts/:id
// @desc   Delete a post
// @access Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById( req.params.id );

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' })
    }
    
    // Check if the user deleting the post owns that post
    if (post.user.toString() !== req.user.id) { // post.user is an ObjectId, not a string
      return res.status(401).json({ msg: 'User not authorized' });
    }
    
    await post.remove();
    res.json({ msg: 'Post removed' });
  } catch (e) {
    if (e.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' })
    }
    console.error(e.message);
    res.status(500).send('Server error');
  }
});

// @route  PUT api/posts/like/:id
// @desc   Like a post
// @access Private
router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Check if post has already been liked
    if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
      return res.status(400).json({ msg: 'Post already liked' });
    }

    post.likes.unshift({ user: req.user.id });

    await post.save();
    res.json(post.likes);
  } catch (e) {
    console.error(e.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;