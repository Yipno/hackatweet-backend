var express = require('express');
var router = express.Router();

require('../models/connection');
const User = require('../models/users');
const Tweet = require('../models/tweets');

// TEST : GET all tweets
router.get('/', (req, res) => {
 Tweet.find().then(data => {
   res.json({ allTweets: data });
 });
});

// ROUTE POST TWEET
router.post('/newtweet/:token', (req, res) => {
    // Check if the user is connected
   User.findOne({ token: req.params.token }).then(data => {
    if (data) {
        
        const newTweet = new Tweet ({
        content: req.body.content,
        date: new Date(),
        user: data._id,
        });

        newTweet.save().then(data => {
        res.json({ result: true, tweet: data });
      });
    } else {
      // User is not connected
      res.json({ result: false, error: 'User not connected' });
    }
  });
});

/*
  // Check if the user has not already been registered
  User.findOne({ username: req.body.username}).then(data => {
    if (data === null) {
      const hash = bcrypt.hashSync(req.body.password, 10);

      const newUser = new User({
        firstname: req.body.firstname,
        username: req.body.username,
        password: hash,
        token: uid2(32),
      });

      newUser.save().then(newData => {
        res.json({ result: true, token: newData.token });
      });
    } else {
      // User already exists in database
      res.json({ result: false, error: 'User already exists' });
    }
  });
});
*/

module.exports = router;
