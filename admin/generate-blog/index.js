// Pull info from database and build file structure of site
const db = require('../db');
const path = require('path');
const fse = require('fs-extra');
const { markdown } = require('markdown');

const { getPageHtml } = require('./build/Page');
const { getPostHtml } = require('./build/Post');
const { getHomePageHtml } = require('./build/HomePage');
const { getCategoryPageHtml } = require('./build/CategoryPage');

const DOCS_DIR = path.resolve(__dirname, '../../docs');
const ICONS_DIR = path.resolve(__dirname, 'icons');
const cssFile = path.resolve(__dirname, 'build/index.css');

// Empty out docs folder (except for images)
const clearDocsFolder = async () => {

	const foldersToKeep = new Set(['img', 'icons', 'js']);
	const files = await fse.readdir(DOCS_DIR);
	const pathsToDelete = files.filter(f => !foldersToKeep.has(f));
	for (let p of pathsToDelete) {
		await fse.remove(path.join(DOCS_DIR, p));
	}
}


module.exports = {

	async build() {
		let posts = await db.getPosts();
		
		const postsLookup = {};

		// newest first
		posts.sort((a, b) => new Date(a.date) > new Date(b.date) ? -1 : 1);
		
		// Get HTML path for post and create lookup table for json file
		posts.forEach(p => {
			const postDate = new Date(p.date);
			const year = postDate.getFullYear();
			const month = (postDate.getMonth() + 1).toString().padStart(2, '0');
			
			p.htmlPath = `/${year}/${month}/`;
			p.fullUrl = p.htmlPath + p.cleanTitle;

			postsLookup[p.id] = {
				title: p.title,
				thumbnail: p.thumbnail,
				url: p.fullUrl,
				date: postDate
			};
		});

		// link previous and next posts
		posts.forEach((p, i) => {
			if (i !== 0) {
				const nextPost = posts[i - 1];
				p.next = nextPost.fullUrl;
			}
			if (i + 1 !== posts.length) {
				const prevPost = posts[i + 1];
				p.prev = prevPost.fullUrl;
			}
		});
		
		// Create proper folders for posts
		const createFolders = posts.map(p => fse.ensureDir(path.join(DOCS_DIR, p.htmlPath)));
		await Promise.all(createFolders);

		// Copy over css
		const cssDir = path.join(DOCS_DIR, 'css');
		await fse.ensureDir(cssDir);
		await fse.copyFile(cssFile, path.join(cssDir, 'style.css'));
	
		// Create html files
		for (let post of posts) {
			let { title, next, prev, date, fullUrl } = post;

			const tags = await db.getTagsForPost(post.id);

			date = new Date(date);
			const markdownText = post.body || '';
			
			const tree = markdown.parse(markdownText);
			const html = markdown.renderJsonML(markdown.toHTMLTree(tree));
			const postHtml = getPostHtml(html, { title, next, prev, date }, tags);
			const pageHtml = getPageHtml(postHtml);

			await fse.writeFile(path.join(DOCS_DIR, fullUrl + '.html'), pageHtml);
			
			
		}

		// Create home page with recent posts
		const indexPath = path.join(DOCS_DIR, 'index.html');
		const homePageHtml = getPageHtml(
			getHomePageHtml(posts)
		);
		await fse.writeFile(indexPath, homePageHtml);
		
		// Create other non-blog post pages
		const pages = await db.getPages();
		for (let page of pages) {
			let { title, url, body } = page;

			const markdownText = body || '';
			const tree = markdown.parse(markdownText);
			const html = markdown.renderJsonML(markdown.toHTMLTree(tree));
			const postHtml = getPostHtml(html, { title, url });
			const pageHtml = getPageHtml(postHtml, { currentUrl: url });

			const pageLocation = path.join(DOCS_DIR, `${url}.html`);
			await fse.writeFile(pageLocation, pageHtml);
		}

		// Create .json files to be loaded for lookup purposes
		const jsonDir = path.join(DOCS_DIR, 'json');
		await fse.ensureDir(jsonDir);
		await fse.writeFile(path.join(jsonDir, 'posts.json'), JSON.stringify(postsLookup));
		
		const tagToPostLookup = await db.getTagToPostsLookup();
		await fse.writeFile(path.join(jsonDir, 'tags.json'), JSON.stringify(tagToPostLookup));
		
		// Create category directory pages
		const categories = await db.getCategories();
		const catToPostIdsLookup = await db.getCategoryPostsLookup();
		for (let c of categories) {
			const pageName = c.name.toLowerCase();
			const postIds = catToPostIdsLookup.get(c.id);
			const posts = [...postIds].map(id => postsLookup[id]).filter(x => x);
			const catPageHtml = getCategoryPageHtml(c, posts);
			const pageHtml = getPageHtml(catPageHtml, { currentUrl: pageName });

			const filePath = path.join(DOCS_DIR, `${pageName}.html`);
			await fse.writeFile(filePath, pageHtml);
		}


		// Create tags page (page to see all posts with given tag)
		const pageHtml = getPageHtml('<div class="post"></div>', { js: 'tagSearch.js' });
		await fse.writeFile(path.join(DOCS_DIR, 'tags.html'), pageHtml);

	}

};

const main = async () => {
	await clearDocsFolder();
	module.exports.build();
	console.log('site built');
}
main();
