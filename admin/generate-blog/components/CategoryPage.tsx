import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const NUM_PER_ROW = 3;

export const getCategoryPageHtml = (category, posts) => {

	if (!posts.length) {
		return renderToStaticMarkup(
			<div className="post card empty-cat">
				Nothing here yet
			</div>
		);
	}


	const postEls = posts.map((p, i) => (
		<a href={p.url} key={i} className="post-card card" style={{ backgroundImage: `url(${p.thumbnail})`}}>
			<div className="title">{p.title}</div>
		</a>
	));

	const rows = [];
	while (postEls.length) {
		rows.push(postEls.splice(0, NUM_PER_ROW));
	}

	const rowEls = rows.map((posts, i) => (
		<div className="row" key={i}>{ posts }</div>
	));

	return renderToStaticMarkup(
		<div className="post-cards">
			{ rowEls }
		</div>
	);
};
