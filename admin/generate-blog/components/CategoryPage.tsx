import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const NUM_PER_ROW = 3;
const NUM_PER_ROW_SMALL = 2;

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

	const getRows = (numPerRow: number): JSX.Element[] => {
		const rows = [];
		const allPosts = [...postEls];
		while (allPosts.length) {
			rows.push(allPosts.splice(0, numPerRow));
		}
		
		return rows.map((posts, i) => (
			<div key={i} className="row">{ posts }</div>
		));
	}

	return renderToStaticMarkup(
		<>
			<div className="post-cards large">
				{ getRows(NUM_PER_ROW) }
			</div>
			<div className="post-cards small">
				{ getRows(NUM_PER_ROW_SMALL) }
			</div>
		</>
	);
};
