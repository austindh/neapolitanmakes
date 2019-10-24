import * as React from 'react';
import ReactHtmlParser from 'react-html-parser';
import { renderToStaticMarkup } from 'react-dom/server';

interface PostHtmlProps {
	title: string
	prev?: string
	next?: string
	date?: Date
	url?: string
}

export const getPostHtml = (html: string, props: PostHtmlProps, tags?) => {

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

	let titleEl = <h1>{title}</h1>;
	return renderToStaticMarkup(
		<div className="post card">
			{ titleEl }
			{ postContents }
		</div>
	);
};
