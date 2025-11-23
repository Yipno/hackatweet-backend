var express = require('express');
var router = express.Router();

require('../models/connection');
const User = require('../models/users');
const Tweet = require('../models/tweets');

// TEST : GET tweets by hashtag / all tweets
router.get('/', (req, res) => {
  if (req.query.hashtag) {
    Tweet.find({ content: { $regex: new RegExp(req.query.hashtag, 'i') } })
      .populate('user')
      .populate('likes')
      .then(data => {
        res.json({ hashtag: data });
      });
  } else {
    Tweet.find()
      .populate('user')
      .populate('likes')
      .then(data => {
        res.json({ allTweets: data });
      });
  }
});

// ROUTE POST TWEET
router.post('/newtweet/:token', (req, res) => {
  // Check if the user is connected
  User.findOne({ token: req.params.token }).then(data => {
    if (data) {
      const newTweet = new Tweet({
        content: req.body.content,
        date: new Date(),
        user: data._id,
        likes: [],
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

// ROUTE POST LIKE
router.post('/like/:token', (req, res) => {
  // Check if the user is connected
  User.findOne({ token: req.params.token }).then(data => {
    if (data) {
      console.log('userData:', data);
      let user = data._id;
      console.log('user:', user);
      // Find tweet
      Tweet.findOne({ _id: req.body.tweetId }).then(data => {
        console.log('tweetData:', data);
        const likesCount = data.likes;
        likesCount.push(user);
        console.log('likesCount:', likesCount);
        Tweet.updateOne({ _id: req.body.tweetId }, { likes: likesCount }).then(data => {
          res.json({ result: true, tweet: data });
          console.log('tweetUpdatedData:', data);
        });
      });
    } else {
      // User is not connected
      res.json({ result: false, error: 'User not connected' });
    }
  });
});

// ROUTE DELETE LIKE
router.post('/dislike/:token', (req, res) => {
  // Check if the user is connected
  User.findOne({ token: req.params.token }).then(data => {
    if (data) {
      console.log('userData:', data);
      let user = data._id;
      console.log('user:', user);
      // Find tweet
      Tweet.findOne({ _id: req.body.tweetId }).then(data => {
        console.log('tweetData:', data);
        const likesCount = data.likes;
        const updatedLikes = likesCount.filter(id => id.toString() !== user.toString());
        console.log('likesCount:', likesCount);
        Tweet.updateOne({ _id: req.body.tweetId }, { likes: updatedLikes }).then(data => {
          res.json({ result: true, tweet: data });
          console.log('tweetUpdatedData:', data);
        });
      });
    } else {
      // User is not connected
      res.json({ result: false, error: 'User not connected' });
    }
  });
});

// ROUTE DELETE TWEET
router.delete('/:id', (req, res) => {
  Tweet.deleteOne({ _id: req.params.id })
    // .then(() => {
    //   Tweet.find()
    .then(deletedDoc => {
      if (deletedDoc.deletedCount > 0) {
        // document successfully delete
        res.json({ result: true, message: 'tweet deleted' });
      } else {
        res.json({ result: false, error: 'Tweet not found' });
      }
    });
});

module.exports = router;
