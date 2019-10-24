import { loadJson } from './loadJson';

const main = async () => {
	const [postLookup, tagLookup] = await Promise.all([loadJson('posts.json'), loadJson('tags.json')]);

	const { search } = window.location;
	const tagName = decodeURIComponent(search.split('?tag=')[1]);

	const postIds = tagLookup[tagName] || [];
	const posts = postIds.map(postId => {
		const post = postLookup[postId];
		if (!post) {
			return null;
		}

		const cardHtml = `
			<a href=${post.url} class="post-card card" style="background-image:url(${post.thumbnail})">
				<div class="title">${post.title}</div>
			</a>
		`;
		return cardHtml;
	});
	const numMatches = posts.length;

	const rows = [];
	while (posts.length) {
		rows.push(posts.splice(0, 3));
	}

	const rowEls = rows.map(posts => `<div class="row">${ posts.join('\n') }</div>`);

	const targetEl = document.querySelector('.post');
	const matches = numMatches === 1 ? 'match' : 'matches'
	targetEl.innerHTML = `
		<div class="match-summary">
			<span>${numMatches} ${matches} for tag:</span>
			<div class="tag active">${tagName}</div>
		</div>
		<div class="post-cards">
			${rowEls.join('\n')}
		</div>
	`;


};
main();
