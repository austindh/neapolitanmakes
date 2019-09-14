"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPageHtml = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactHtmlParser = _interopRequireDefault(require("react-html-parser"));

var _server = require("react-dom/server");

var _Header = _interopRequireDefault(require("./Header"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Main page
var getPageHtml = function getPageHtml(postHtml) {
  var isFirst = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  // const cssPrefix = isFirst ? '' : '../../';
  // const cssUrl = cssPrefix + 'css/style.css'; 
  var cssUrl = '/css/style.css';
  return (0, _server.renderToStaticMarkup)(_react.default.createElement("html", null, _react.default.createElement("head", null, _react.default.createElement("meta", {
    name: "viewport",
    content: "width=device-width, initial-scale=1.0"
  }), _react.default.createElement("link", {
    href: "https://fonts.googleapis.com/css?family=Montserrat",
    rel: "stylesheet"
  }), _react.default.createElement("link", {
    href: cssUrl,
    rel: "stylesheet"
  })), _react.default.createElement("body", null, _react.default.createElement(_Header.default, null), (0, _reactHtmlParser.default)(postHtml))));
};

exports.getPageHtml = getPageHtml;