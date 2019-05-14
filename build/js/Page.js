'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.getPageHtml = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactHtmlParser = require('react-html-parser');

var _reactHtmlParser2 = _interopRequireDefault(_reactHtmlParser);

var _server = require('react-dom/server');

var _Header = require('./Header');

var _Header2 = _interopRequireDefault(_Header);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Main page
const getPageHtml = exports.getPageHtml = (postHtml, isFirst = false) => {

	const cssPrefix = isFirst ? '' : '../../';
	const cssUrl = cssPrefix + 'css/style.css';

	return (0, _server.renderToStaticMarkup)(_react2.default.createElement(
		'html',
		null,
		_react2.default.createElement(
			'head',
			null,
			_react2.default.createElement('meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }),
			_react2.default.createElement('link', { href: 'https://fonts.googleapis.com/css?family=Slabo+27px', rel: 'stylesheet' }),
			_react2.default.createElement('link', { href: cssUrl, rel: 'stylesheet' })
		),
		_react2.default.createElement(
			'body',
			null,
			_react2.default.createElement(_Header2.default, null),
			(0, _reactHtmlParser2.default)(postHtml)
		)
	));
};