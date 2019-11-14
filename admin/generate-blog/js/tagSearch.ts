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

	const getRows = (numPerRow: number): string => {
		const rows = [];
		const allPosts = [...posts];
		while (allPosts.length) {
			rows.push(allPosts.splice(0, numPerRow));
		}

		return rows.map(posts => `<div class="row">${ posts.join('\n') }</div>`).join('\n');
	}

	const targetEl = document.querySelector('.post');
	const matches = numMatches === 1 ? 'match' : 'matches'
	targetEl.innerHTML = `
		<div class="match-summary">
			<span>${numMatches} ${matches} for tag:</span>
			<div class="tag active">${tagName}</div>
		</div>
		<div class="post-cards large">
			${getRows(3)}
		</div>
		<div class="post-cards small">
			${getRows(2)}
		</div>
	`;


};
main();
