const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrAapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const ListingController = require("../controller/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// FINAL FIXED INDEX ROUTE
router.get("/", wrapAsync(ListingController.index));


// CREATE route
router.post(
  "/",
  isLoggedIn,
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(ListingController.createlist)
);

// New Route
router.get("/new", isLoggedIn, ListingController.renderNew);

// Show, Update, Delete Route
router
  .route("/:id")
  .get(isLoggedIn, wrapAsync(ListingController.renderShow))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(ListingController.renderUpdate)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(ListingController.destroyList));

// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(ListingController.renderEdit));





module.exports = router;
