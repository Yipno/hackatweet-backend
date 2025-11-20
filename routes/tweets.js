var express = require("express");
var router = express.Router();

require("../models/connection");
const User = require("../models/users");
const Tweet = require("../models/tweets");

// TEST : GET tweets by hashtag / all tweets
router.get("/", (req, res) => {
  if (req.query.hashtag) {
    Tweet.find({ content: {$regex : req.query.hashtag} })
    .populate('user')
    .then((data) => {
    res.json({ hashtag: data });
      });
    } else {
      Tweet.find()
      .populate('user')
      .then((data) => {
    res.json({ allTweets: data });
    });
  }
});

// ROUTE POST TWEET
router.post("/newtweet/:token", (req, res) => {
  // Check if the user is connected
  User.findOne({ token: req.params.token }).then((data) => {
    if (data) {
      const newTweet = new Tweet({
        content: req.body.content,
        date: new Date(),
        user: data._id,
      });

      newTweet.save().then((data) => {
        res.json({ result: true, tweet: data });
      });
    } else {
      // User is not connected
      res.json({ result: false, error: "User not connected" });
    }
  });
});

// ROUTE DELETE TWEET
router.delete('/', (req, res) => {
  Tweet.deleteOne({ _id : req.params.id})
    .then(() => {
      Tweet.find()
        .then(data => res.json({ message: "tweet deleted", allTweets: data }))})
    });

module.exports = router;
