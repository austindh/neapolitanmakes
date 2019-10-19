import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const NUM_POSTS = 9;
const NUM_PER_ROW = 3;

export const getHomePageHtml = posts => {

	const recentPosts = posts.slice(0, NUM_POSTS).map((p, i) => {
		const { title, thumbnail, fullUrl: url } = p;
		return (
			<a href={url} key={i} className="post-card card" style={{ backgroundImage: `url(${thumbnail})`}}>
				<div className="title">{title}</div>
			</a>
		)
	});

	const rows = [];
	while (recentPosts.length) {
		rows.push(recentPosts.splice(0, NUM_PER_ROW));
	}

	const rowEls = rows.map((posts, i) => (
		<div className="row">{ posts }</div>
	));

	return renderToStaticMarkup(
		<div>
			<div className="recent-posts-title">Recent Posts</div>
			<div className="post-cards">
				{ rowEls }
			</div>
		</div>
	);
};
