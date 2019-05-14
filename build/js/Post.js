'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.getPostHtml = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactHtmlParser = require('react-html-parser');

var _reactHtmlParser2 = _interopRequireDefault(_reactHtmlParser);

var _server = require('react-dom/server');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getPostHtml = exports.getPostHtml = (html, props) => {

	const { title, prev, next, date } = props;
	// console.log( 'props:', props );

	const nextLink = next ? _react2.default.createElement(
		'a',
		{ href: next },
		'Newer'
	) : '';
	const prevLink = prev ? _react2.default.createElement(
		'a',
		{ href: prev },
		'Older'
	) : '';

	return (0, _server.renderToStaticMarkup)(_react2.default.createElement(
		'div',
		{ className: 'post' },
		_react2.default.createElement(
			'h1',
			null,
			title
		),
		_react2.default.createElement(
			'div',
			{ className: 'date' },
			date.toLocaleDateString('en')
		),
		(0, _reactHtmlParser2.default)(html),
		nextLink,
		prevLink
	));
};