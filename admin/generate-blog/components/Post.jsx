import React from 'react';
import ReactHtmlParser from 'react-html-parser';
import { renderToStaticMarkup } from 'react-dom/server';

export const getPostHtml = (html, props, tags) => {

	const { title, prev, next, date, url } = props;

	const nextLink = next ? <a href={next}>{'< Newer Post'}</a> : <span></span>;
	const prevLink = prev ? <a href={prev}>{'Older Post >'}</a> : <span></span>;

	let tagsContent;
	if (tags && tags.length) {
		tags = tags.map((t, i) => (
				<a href={`/tags?tag=${encodeURIComponent(t)}`}>
			<div key={i} className="tag">
					{t}
			</div>
				</a>
		));
		tagsContent = <div className="tags">{tags}</div>;
	}

	let postContents;
	if (url) { // standalone page
		postContents = ReactHtmlParser(html);
	} else {
		postContents = ([
			<div className="date">{date.toLocaleDateString('en')}</div>,
			ReactHtmlParser(html),
			tagsContent,
			<div className="links">
				{ nextLink }
				{ prevLink }
			</div>
		]);
	}


	return renderToStaticMarkup(
		<div className="post card">
			<h1>{ title }</h1>
			{ postContents }
		</div>
	);
};
