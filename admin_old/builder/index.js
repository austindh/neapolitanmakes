// Pull info from database and build file structure of site
const db = require('../db');
const path = require('path');
const fse = require('fs-extra');
const { markdown } = require('markdown');

const { getPageHtml } = require('../../build/js/Page');
const { getPostHtml } = require('../../build/js/Post');

const DOCS_DIR = path.resolve(__dirname, '../../docs');
const ADMIN_DIR = path.resolve(__dirname, '../../admin');

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
		
		// console.log( 'posts:', posts );

		// Create proper folders for img folder and posts
		await fse.ensureDir(path.join(DOCS_DIR, 'imgaa'));
		const createFolders = posts.map(p => fse.ensureDir(path.join(DOCS_DIR, p.htmlPath)));
		await Promise.all(createFolders);
		
		// TODO delete previous contents of docs

		// Copy over images from temp folder to images folder
		// TODO future extra processing here
		const adminImages = path.join(ADMIN_DIR, 'temp');
		const siteImages = path.join(DOCS_DIR, 'img');
		await fse.copy(adminImages, siteImages);

		// Create html files
		let first = true;
		posts = [posts[0], ...posts]; // duplicate first post for index
		for (let post of posts) {
			let { title, next, prev, date } = post;
			// TODO temp figure this out
			if (next) {
				next = `../..${next}`;
			}
			if (prev) {
				if (first) {
					prev = `../site${prev}`;
				} else {
					prev = `../..${prev}`;
				}
			}

			date = new Date(date);
			const markdownText = post.body || '';
			
			// Update image urls to replace 'temp' with 'img'
			// TODO change admin 'temp' dir to be named 'img' to make this unnecessary
			const updateImages = entry => {
				if (entry[0] === 'img') {
					const data = entry[1];
					// console.log( 'data.href:', data );
					if (data.href && data.href.replace) {
						data.href = data.href.replace('temp', 'site/img');
						// console.log( 'data.href:', data.href );
					}
				}

				entry.forEach(e => {
					if (Array.isArray(e)) {
						updateImages(e);
					}
				});
			};
			
			const tree = markdown.parse(markdownText);
			updateImages(tree);
			const html = markdown.renderJsonML(markdown.toHTMLTree(tree));
			const postHtml = getPostHtml(html, { title, next, prev, date });
			const pageHtml = getPageHtml(postHtml, first);

			await fse.writeFile(path.join(DOCS_DIR, post.fullUrl,), pageHtml);
			
			// newest post is new index.html
			if (first) {
				first = false;
				await fse.writeFile(path.join(DOCS_DIR, 'index.html'), pageHtml);
			}

		}



	}

};
