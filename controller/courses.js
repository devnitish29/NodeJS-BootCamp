const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Course = require("../model/Course");
const BootCamp = require("../model/Bootcamp");

// @desc  Get all Courses
// @route GET /api/v1/courses
// @route GET /api/v1/bootcamps/:bootcampId/courses
// @access public
exports.getCourses = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const courses = await Course.find({ bootcamp: req.params.bootcampId });
    return res
      .status(200)
      .json({ success: true, count: courses.length, data: courses });
  } else {
    return res.status(200).json(res.advancedResults);
  }
});

// @desc  Create a single Course
// @route POST /api/v1/bootcamps/:bootcampId/courses
// @access private
exports.addCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;

  const bootCamp = await await BootCamp.findById(req.params.bootcampId);

  if (!bootCamp) {
    return next(
      new ErrorResponse(`No Bootcamp found with ${req.params.bootcampId}`),
      404
    );
  }

  //Make sure user is bootcamp owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this course to ${bootCamp._id} `,
        401
      )
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

// @desc  Update a single Course
// @route PUT /api/v1/courses/:id
// @access private
exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = await await Course.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(`No course found with ${req.params.id}`),
      404
    );
  }
  //Make sure user is course owner
  if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this course `,
        401
      )
    );
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: course });
});

// @desc  Delete a single Course
// @route PUT /api/v1/courses/:id
// @access private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await await Course.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(`No course found with ${req.params.id}`),
      404
    );
  }

  //Make sure user is course owner
  if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this course `,
        401
      )
    );
  }

  await course.remove();

  res.status(200).json({ success: true, data: {} });
});
