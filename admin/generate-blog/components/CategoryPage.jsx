import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

export const getCategoryPageHtml = (category, posts) => {

	// console.log('posts', posts);

	if (!posts.length) {
		return renderToStaticMarkup(
			<div className="post card empty-cat">
				Nothing here yet
			</div>
		);
	}

	return renderToStaticMarkup(
		<div className="">
			HEY CATEGORY PAGE
		</div>
	);
};
