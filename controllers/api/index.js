const router = require('express').Router();

//Adds ./user-routes, ./post-routes or ./comment-routes 
//after the route in main index.js
const userRoute = require('./user-routes');
const postRoute = require('./post-routes')
const commentRoute = require('./comment-routes');

//Adds middleware to call route above
router.use('/users', userRoute);
router.use('/posts', postRoute);
router.use('/comments', commentRoute);

module.exports = router;