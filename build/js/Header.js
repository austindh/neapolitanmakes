"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Header = props => {
	return [_react2.default.createElement(
		"div",
		{ id: "header" },
		_react2.default.createElement(
			"span",
			{ id: "nea" },
			"NEA"
		),
		_react2.default.createElement(
			"span",
			{ id: "politan" },
			"POLITAN"
		),
		_react2.default.createElement(
			"span",
			{ id: "makes" },
			"MAKES"
		)
	), _react2.default.createElement(
		"div",
		{ id: "tabs" },
		_react2.default.createElement(
			"div",
			{ className: "tab active" },
			"Home"
		),
		_react2.default.createElement(
			"div",
			{ className: "tab" },
			"About"
		)
	)];
}; // Main page
exports.default = Header;