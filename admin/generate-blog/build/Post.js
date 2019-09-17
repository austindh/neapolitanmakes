"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPostHtml = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactHtmlParser = _interopRequireDefault(require("react-html-parser"));

var _server = require("react-dom/server");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getPostHtml = function getPostHtml(html, props) {
  var title = props.title,
      prev = props.prev,
      next = props.next,
      date = props.date;
  var nextLink = next ? _react.default.createElement("a", {
    href: next
  }, "Newer") : '';
  var prevLink = prev ? _react.default.createElement("a", {
    href: prev
  }, "Older") : '';
  return (0, _server.renderToStaticMarkup)(_react.default.createElement("div", {
    className: "post"
  }, _react.default.createElement("h1", null, title), _react.default.createElement("div", {
    className: "date"
  }, date.toLocaleDateString('en')), (0, _reactHtmlParser.default)(html), nextLink, prevLink));
};

exports.getPostHtml = getPostHtml;