"use strict";

var _express = _interopRequireDefault(require("express"));
var _userRoutes = _interopRequireDefault(require("./routes/userRoutes.js"));
var _customerRoutes = _interopRequireDefault(require("./routes/customerRoutes.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var app = (0, _express["default"])();
var port = 3000;
app.use(_express["default"].json());
app.use(_express["default"].urlencoded({
  extended: true
}));
app.use("/v1/api/user", _userRoutes["default"]);
app.use("/v1/api/customer", _customerRoutes["default"]);
app.listen(port, function () {
  console.log("Server is running on http://localhost:".concat(port));
});