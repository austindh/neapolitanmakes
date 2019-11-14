import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const NUM_POSTS = 9;
const NUM_PER_ROW = 3;
const NUM_PER_ROW_SMALL = 2;

export const getHomePageHtml = posts => {

	const recentPosts = posts.slice(0, NUM_POSTS).map((p, i) => {
		const { title, thumbnail, fullUrl: url } = p;
		return (
			<a href={url} key={i} className="post-card card" style={{ backgroundImage: `url(${thumbnail})`}}>
				<div className="title">{title}</div>
			</a>
		)
	});

	const getRows = (numPerRow: number): JSX.Element[] => {
		const rows = [];
		const posts = [...recentPosts];
		while (posts.length) {
			rows.push(posts.splice(0, numPerRow));
		}
		
		return rows.map((posts, i) => (
			<div key={i} className="row">{ posts }</div>
		));
	}

	return renderToStaticMarkup(
		<div>
			<div className="recent-posts-title">Recent Posts</div>
			<div className="post-cards large">
				{ getRows(NUM_PER_ROW) }
			</div>
			<div className="post-cards small">
				{ getRows(NUM_PER_ROW_SMALL) }
			</div>
		</div>
	);
};
