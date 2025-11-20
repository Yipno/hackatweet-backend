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

module.exports = router;
