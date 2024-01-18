const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const camp = require('../controllers/campgrounds')



router.get('/', catchAsync(camp.renderCampground));

router.get('/new', isLoggedIn, camp.renderNewCampground)

router.post('/',isLoggedIn, validateCampground, catchAsync(camp.createCampground))

router.get('/:id', catchAsync(camp.getCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(camp.renderEdit))

router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(camp.editCampground));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(camp.deleteCampground));

module.exports = router;