// Pull info from database and build file structure of site
const db = require('../db');
const path = require('path');
const fse = require('fs-extra');
const { markdown } = require('markdown');

const { getPageHtml } = require('./build/Page');
const { getPostHtml } = require('./build/Post');

const DOCS_DIR = path.resolve(__dirname, '../../docs');
const ICONS_DIR = path.resolve(__dirname, 'icons');
const cssFile = path.resolve(__dirname, 'build/index.css');

// Empty out docs folder (except for images)
const clearDocsFolder = async () => {

	const foldersToKeep = new Set(['img', 'icons']);
	const files = await fse.readdir(DOCS_DIR);
	const pathsToDelete = files.filter(f => !foldersToKeep.has(f));
	for (let p of pathsToDelete) {
		await fse.remove(path.join(DOCS_DIR, p));
	}
}


module.exports = {

	async build() {
		let posts = await db.getPosts();
		
		// newest first
		posts.sort((a, b) => new Date(a.date) > new Date(b.date) ? -1 : 1);
		
		// Get HTML path for post
		posts.forEach(p => {
			const postDate = new Date(p.date);
			const year = postDate.getFullYear();
			const month = postDate.getMonth() + 1;
			
			p.htmlPath = `/${year}/${month}/`;
			p.fullUrl = p.htmlPath + p.cleanTitle + '.html';
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
		let first = true;
		posts = [posts[0], ...posts]; // duplicate first post for index
		for (let post of posts) {
			let { title, next, prev, date } = post;

			date = new Date(date);
			const markdownText = post.body || '';
			
			const tree = markdown.parse(markdownText);
			// updateImages(tree);
			const html = markdown.renderJsonML(markdown.toHTMLTree(tree));
			const postHtml = getPostHtml(html, { title, next, prev, date });
			const pageHtml = getPageHtml(postHtml, first);

			await fse.writeFile(path.join(DOCS_DIR, post.fullUrl,), pageHtml);
			
			// newest post is new index.html
			if (first) {
				first = false;
				const indexPath = path.join(DOCS_DIR, 'index.html');
				await fse.writeFile(indexPath, pageHtml);
			}

		}



	}

};

const main = async () => {
	await clearDocsFolder();
	module.exports.build();
	console.log('site built');
}
main();
