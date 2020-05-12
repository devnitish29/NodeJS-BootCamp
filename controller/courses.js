const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Course = require("../model/Course");
const BootCamp = require("../model/Bootcamp");

// @desc  Get all Courses
// @route GET /api/v1/courses
// @route GET /api/v1/bootcamps/:bootcampId/courses
// @access public
exports.getCourses = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.bootcampId) {
    query = Course.find({ bootcamp: req.params.bootcampId });
  } else {
    query = Course.find().populate({
      path: "bootcamp",
      select: "name description",
    });
  }

  const courses = await query;

  res.status(200).json({ success: true, count: courses.length, data: courses });
});

// @desc  Create a single Course
// @route POST /api/v1/bootcamps/:bootcampId/courses
// @access private
exports.addCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;

  const bootCamp = await await BootCamp.findById(req.params.bootcampId);

  if (!bootCamp) {
    return next(
      new ErrorResponse(`No Bootcamp found with ${req.params.bootcampId}`),
      404
    );
  }
  const course = await Course.create(req.body);

  res.status(200).json({ success: true, data: course });
});

// @desc  Add a single Course
// @route GET /api/v1/courses/:id
// @access public
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await (await Course.findById(req.params.id)).populate({
    path: "bootcamp",
    select: "name description",
  });

  if (!course) {
    return next(
      new ErrorResponse(`No course found with ${req.params.id}`),
      404
    );
  }

  res.status(200).json({ success: true, data: course });
});
