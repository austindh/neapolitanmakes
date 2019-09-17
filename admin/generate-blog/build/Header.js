"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Main page
var tabNames = ['Sewing', 'Food', 'Crafts', 'Home', 'Shop', 'Etsy', 'About'];
var tabs = [_react.default.createElement("div", {
  className: "divider"
})];
tabNames.forEach(function (tabName, i) {
  tabs.push(_react.default.createElement("div", {
    className: "tab"
  }, tabName));
  tabs.push(_react.default.createElement("div", {
    className: "divider"
  }));
});

var Header = function Header(props) {
  return [_react.default.createElement("div", {
    id: "header"
  }, _react.default.createElement("div", {
    className: "logo"
  }, _react.default.createElement("div", {
    className: "main"
  }, _react.default.createElement("span", {
    id: "nea"
  }, "NEA"), _react.default.createElement("span", {
    id: "politan"
  }, "POLITAN"), _react.default.createElement("span", {
    id: "makes"
  }, "MAKES")), _react.default.createElement("div", {
    className: "sub-title"
  }, "Flavors of Creativity")), _react.default.createElement("div", {
    className: "social"
  }, _react.default.createElement("img", {
    alt: "pinterest",
    src: "/icons/pinterest original.svg"
  }), _react.default.createElement("img", {
    alt: "facebook",
    src: "/icons/facebook original.svg"
  }), _react.default.createElement("div", {
    className: "wrapper"
  }, _react.default.createElement("img", {
    id: "instagram",
    alt: "instagram",
    src: "/icons/instagram.svg"
  })), _react.default.createElement("div", {
    className: "wrapper wrapper2"
  }, _react.default.createElement("img", {
    id: "instagram",
    alt: "instagram",
    src: "/icons/instagram.svg"
  })))), _react.default.createElement("div", {
    id: "tabs"
  }, _react.default.createElement("div", {
    className: "container"
  }, tabs))];
};

var _default = Header;
exports.default = _default;