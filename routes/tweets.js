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

module.exports = router;
