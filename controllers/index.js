const router = require('express').Router();

//Adds ./api or ./ before the route
const apiRoute = require('./api');
const homeRoute = require('./home-routes');

//Adds middleware to call route above
router.use('/api', apiRoute);
router.use('/', homeRoute);

module.exports = router;