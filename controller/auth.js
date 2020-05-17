const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const User = require("../model/User");

// @desc  Register user
// @route GET /api/v1/auth/register
// @access public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;
  //Create user
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  const token = user.getSignedJwtToken();

  res.status(200).json({ success: true, token });
});