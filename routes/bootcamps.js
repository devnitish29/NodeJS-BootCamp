const express = require("express");
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
} = require("../controller/bootcamps");

const advancedResults = require("../middleware/advancedResults");
const Bootcamp = require("../model/Bootcamp");

// Include other resource routers
const courseRouter = require("./courses");

const router = express.Router();

const { protect } = require("../middleware/auth");

//Re-route into other resource routes
router.use("/:bootcampId/courses", courseRouter);

router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);

router
  .route("/")
  .get(advancedResults(Bootcamp, "courses"), getBootcamps)
  .post(protect, createBootcamp);

router
  .route("/:id")
  .put(protect, updateBootcamp)
  .delete(protect, deleteBootcamp)
  .get(getBootcamp);
module.exports = router;
