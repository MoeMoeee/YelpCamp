const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const camp = require('../controllers/campgrounds')
const multer  = require('multer')
const {storage} = require('../cloudinary')
const upload = multer({ storage })


router.get('/', catchAsync(camp.renderCampground));

router.get('/new', isLoggedIn, camp.renderNewCampground)

router.post('/',isLoggedIn, upload.array('image'),validateCampground, catchAsync(camp.createCampground))

router.get('/:id', catchAsync(camp.getCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(camp.renderEdit))

router.put('/:id', isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(camp.editCampground));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(camp.deleteCampground));

module.exports = router;