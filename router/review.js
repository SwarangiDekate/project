const express = require("express");
const router = express.Router({ mergeParams: true });

const reviewController = require("../controller/review.js"); // <-- match exact file name

const { validateReview, isLoggedIn } = require("../middleware.js");

// CREATE REVIEW
router.post("/", isLoggedIn, validateReview, reviewController.createReview);

// DELETE REVIEW
router.delete("/:reviewId", isLoggedIn, reviewController.distroyReview);

module.exports = router;

