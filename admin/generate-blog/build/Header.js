"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Main page
var Header = function Header(props) {
  return [_react.default.createElement("div", {
    id: "header"
  }, _react.default.createElement("span", {
    id: "nea"
  }, "NEA"), _react.default.createElement("span", {
    id: "politan"
  }, "POLITAN"), _react.default.createElement("span", {
    id: "makes"
  }, "MAKES")), _react.default.createElement("div", {
    id: "tabs"
  }, _react.default.createElement("div", {
    className: "tab active"
  }, "Home"), _react.default.createElement("div", {
    className: "tab"
  }, "About"))];
};

var _default = Header;
exports.default = _default;