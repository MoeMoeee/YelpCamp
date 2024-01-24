const Campground = require('../models/campground');
const { cloudinary } = require('../cloudinary')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapKey = process.env.MAPBOX_TOKEN;
const geoCode = mbxGeocoding({accessToken: mapKey});

module.exports.renderCampground = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}


module.exports.renderNewCampground = (req, res) => {
    res.render('campgrounds/new');
}


module.exports.createCampground = async (req, res, next) => {
    const response = await geoCode.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send();

    const campground = new Campground(req.body.campground);

    // save coordinate
    campground.geometry = response.body.features[0].geometry;

    // get filename and url after multer populated
    campground.images = req.files.map(f => ({url: f.path, filename: f.filename}));

    // everytime make new camp, save the user to db
    // user._id: id from authenticated user generated by Passport.js
    campground.author = req.user._id; 
    await campground.save();

    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.getCampground = async (req, res,) => {
    // here we populate the reviews and creators of the camp.
    // then we nested populate the author inside review
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');

    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}

module.exports.renderEdit = async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}

module.exports.editCampground = async (req, res) => {
    const {id} = req.params;

    const campground = await Campground.findById(id);

    // Check for permission to update
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that');
        return res.redirect(`/campgrounds/${id}`);
    }

    // Update more information
    campground.set(req.body.campground);
    await campground.save();

    // Update images
    const img = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...img);
    await campground.save();

    // Delete images
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
    }

    // Remove deleted images from the campground document
    await campground.updateOne({
        $pull: {
        images: {
            filename: {
            $in: req.body.deleteImages
            }
        }
        }
    });
    }

    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`);

}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground')
    res.redirect('/campgrounds');
}