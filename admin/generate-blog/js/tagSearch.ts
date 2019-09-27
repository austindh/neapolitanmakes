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
			<div class="card post-summary">
				<img alt="${post.title}" src="${post.thumbnail}"></img>
				<a href="${post.url}" class="title">${post.title}</a>
			</div>
		`;
		return cardHtml;
	});

	const numMatches = posts.length;
	const targetEl = document.querySelector('.post');
	const matches = numMatches === 1 ? 'match' : 'matches'
	targetEl.innerHTML = `
		<div class="match-summary">
			<span>${numMatches} ${matches} for tag:</span>
			<div class="tag active">${tagName}</div> 
		</div>
		<div class="matches">
			${posts.join('\n')}
		</div>
	`;
	

};
main();
