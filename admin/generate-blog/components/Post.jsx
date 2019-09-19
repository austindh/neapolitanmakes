import React from 'react';
import ReactHtmlParser from 'react-html-parser';
import { renderToStaticMarkup } from 'react-dom/server';

export const getPostHtml = (html, props) => {

	const { title, prev, next, date } = props;

	const nextLink = next ? <a href={next}>{'< Newer Post'}</a> : <span></span>;
	const prevLink = prev ? <a href={prev}>{'Older Post >'}</a> : <span></span>;

	return renderToStaticMarkup(
		<div className="post card">
			<h1>{ title }</h1>
			<div className="date">{date.toLocaleDateString('en')}</div>
			{ ReactHtmlParser(html) }
			<div className="links">
				{ nextLink }
				{ prevLink }
			</div>
		</div>
	);
};
