
const Listing = require("../models/listing");
const path = require("path");

// INDEX + CATEGORY FILTER
const Fuse = require("fuse.js");

// module.exports.index = async (req, res) => {
//   const { category, search } = req.query;

  // let queryObject = {};
// module.exports.index = async (req, res) => {
//   const { category,title,country, location,  } = req.query;
//   let queryObject = {};

//   // CATEGORY FILTER
//   if (category && category !== "All things available") {
//     queryObject.category = category;
//   }}

//   // Fetch initial filtered data
//   let listings = await Listing.find(queryObject);

//   // If search (fuzzy) is applied
//   if (title && title.trim() !== "") {
//     const fuse = new Fuse(listings, {
//       keys: ["location", "country", "title"],  
//       threshold: 0.3  // ← lower = more strict, higher = more fuzzy
//     });

//     const results = fuse.search(title);
//   // LOCATION SEARCH
//   if (location && location.trim() !== "") {
//     queryObject.location = { $regex: location, $options: "i" };

//     listings = results.map(r => r.item);
//   }

//   res.render("listings/index", { listings, category, search });
//   };

module.exports.index = async (req, res) => {
  const { category,title,country, location,  } = req.query;
  let queryObject = {};

  // CATEGORY FILTER
  if (category && category !== "All things available") {
    queryObject.category = category;
  }

  // LOCATION SEARCH
  if (location && location.trim() !== "") {
    queryObject.location = { $regex: location, $options: "i" };  // FIXED
  }

  // TITLE SEARCH
  if (title && title.trim() !== "") {
    queryObject.title = { $regex: title, $options: "i" };
  }
  //country
  if (country && country.trim() !== "") {
    queryObject.country = { $regex: country, $options: "i" };
  }

  console.log("FINAL QUERY:", queryObject);

  // ⭐ YOU FORGOT THIS!
  const listings = await Listing.find(queryObject);
  console.log(listings.location)
  res.render("listings/index", { listings,  title, country, category, location});
};


// module.exports.index = async (req, res) => {
//   const { category, location, name } = req.query;

//   const queryObject = {};

//   if (category) queryObject.category = category;

//   if (location) {
//     queryObject.location = { $regex: location, $options: "i" };
//   }

//   if (name) {
//     queryObject.name= { $regex: name, $options: "i" };
//   }
//   console.log(queryObject)

//   const listings = await Listing.find(queryObject);

//   res.render("listings/index", { listings, category, location ,name });
// };


// module.exports.index = async (req, res) => {
//   const { category, location } = req.query;

//   let filter = {};
//   if (category) {
//     filter.category = category;
//   }

//   // const allListings = await Listing.find(filter);    
//   if (location) {
//         listings = await Listing.find({
//             location: { $regex: location, $options: "i" }
//         });
//     } else {
//         listings = await Listing.find({});
//     }

//     res.render("listings/index", { listings, location });
// };

// NEW
module.exports.renderNew = (req, res) => {
  res.render("listings/new.ejs");
};

// SHOW
module.exports.renderShow = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" }
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing you requested for does not exist");
    return res.redirect("/listings");
  }

  res.render("listings/show.ejs", { listing });
};

// CREATE
module.exports.createlist = async (req, res) => {
  if (!req.file) {
    req.flash("error", "Please upload an image!");
    return res.redirect("/listings/new");
  }

  let url = req.file.path;
  let filename = req.file.filename;

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };

  await newListing.save();

  req.flash("success", "New Listing created!");
  res.redirect("/listings");
};

// EDIT
module.exports.renderEdit = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing you requested for does not exist");
    return res.redirect("/listings");
  }

  let originalImage = listing.image.url.replace("/upload", "/upload/h_300,w_250");

  res.render("listings/edit.ejs", { listing, originalImage });
};

// UPDATE
module.exports.renderUpdate = async (req, res) => {
  const { id } = req.params;

  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (req.file) {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
  }

  await listing.save();

  req.flash("success", "Listing updated!");
  res.redirect(`/listings/${id}`);
};

// DELETE
module.exports.destroyList = async (req, res) => {
  const { id } = req.params;

  await Listing.findByIdAndDelete(id);

  req.flash("success", "Listing deleted!");
  res.redirect("/listings");
};
// SEARCH LISTINGS
// module.exports.index = async (req, res) => {
//     const { location } = req.query;
//     let listings;

//     if (location) {
//         listings = await Listing.find({
//             location: { $regex: location, $options: "i" }
//         });
//     } else {
//         listings = await Listing.find({});
//     }

//     res.render("listings/index", { listings, location });
// }