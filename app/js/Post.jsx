import React from 'react';
import ReactHtmlParser from 'react-html-parser';
import { renderToStaticMarkup } from 'react-dom/server';

export const getPostHtml = (html, props) => {

	const { title, prev, next } = props;
	console.log( 'props:', props );

	const nextLink = next ? <a href={next}>Newer</a> : '';
	const prevLink = prev ? <a href={prev}>Older</a> : '';

	return renderToStaticMarkup(
		<div className="post">
			<h1>{ title }</h1>
			{ ReactHtmlParser(html) }
			{ nextLink }
			{ prevLink }
		</div>
	);
};
