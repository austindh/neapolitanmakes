const fse = require('fs-extra');
const parser = require('fast-xml-parser');
const path = require('path');
const _ = require('lodash');
const turndown = new (require('turndown'))();
const unescape = require('unescape');

const db = require('../admin/db');

const blogBackupXmlFile = path.resolve(__dirname, 'blog-09-20-2019.xml');
const jsonFile = path.resolve(__dirname, 'blog.json');

const xmlParserOptions = {
	ignoreAttributes: false,
	attributeNamePrefix: ''
};

const getXmlBackupTextContent = async () => {
	const data = await fse.readFile(blogBackupXmlFile);
	return data.toString();
};

const writeToFileAsJSON = jsonObj => {
	const jsonString = JSON.stringify(jsonObj, null, 4);
	return fse.writeFile(jsonFile, jsonString);
};

const main = async () => {
	console.log('blogger backup');
	const xmlData = await getXmlBackupTextContent();
	const jsonObj = parser.parse(xmlData, xmlParserOptions);


	// entries includes settings, blog posts, and other things
	let entries = jsonObj.feed.entry;
	console.log('entries length:', entries.length);
	
	let i = 0;
	const blogPosts = entries.map(e => {
		let { category } = e;

		const post = {
			id: e.id,
			published: e.published,
			updated: e.updated,
			title: _.get(e, 'title.#text'),
			html: unescape(_.get(e, 'content.#text') || ''),
			thumbnail: _.get(e, 'media:thumbnail.url')
		};
		
		// look in 'category' for object with key of term including "kind#post" ('category' can be single object or array of objects)
		if (!Array.isArray(category)) {
			category = [category];
		}
		
		const isBlogPost = category.some(c => c.term.includes('kind#post'));
		const isDraft = _.get(e, 'app:control.app:draft') === 'yes';
		if (!isBlogPost || isDraft) {
			return null;
		}

		// get tags
		const tags = category
			.filter(c => c.scheme.includes('/atom/ns#'))
			.map(c => c.term);

		// get url
		const [ url ] = (_.get(e, 'link') || [])
			.filter(x => x.rel === 'alternate')
			.map(x => x.href.split('highness.com/')[1]);
		const cleanTitle = url.split('/')[2].split('.html')[0];

		// get all images from inside html
		const images = [];
		let matches;
		const regex = /src="(.*?)"/g;
		while ((matches = regex.exec(post.html)) !== null) {
			images.push(matches[1]);
		}

		// translate html into markdown
		let markdown = turndown.turndown(post.html);
		markdown = markdown.replace(/\n\n/g, '  \n'); // get rid of extra new lines
		markdown = markdown.replace(/http:\/\/(www\.)?hungryhungryhighness(\.blogspot)?\.com\//g, '/'); // make old links relative links to new blog

		// markdown = markdown.replace(/---+/g, '');

		Object.assign(post, {
			tags,
			url,
			cleanTitle,
			images,
			markdown
		});

		delete post.html;

		return post;
	}).filter(x => x !== null);
	const numImages = blogPosts.map(x => x.images.length).reduce((a, b) => a + b);
	console.log('posts length:', blogPosts.length);
	console.log('numImages', numImages);

	// Clear posts table and insert all
	await db._resetDbForBlogger();

	const tagCategories = await db.getCategories();
	const foodCategoryId = tagCategories.find(x => x.name === 'Food').id;
	console.log('foodCategoryId', foodCategoryId);

	for (let post of blogPosts) {
		const newPost = await db.createPost();
		const dbPost = {
			id: newPost.id,
			date: new Date(post.published),
			title: post.title,
			cleanTitle: post.cleanTitle,
			body: post.markdown,
			thumbnail: post.thumbnail
		}
		// id, date, title, cleanTitle, body 
		await db.updatePost(dbPost);

		// create/insert/link all tags
		for (let tagName of post.tags) {
			const tag = await db.addTagIfNeeded(tagName, foodCategoryId);
			await db.addTagToPost(newPost.id, tag.id);
		}

	}

	// TEMP - for debugging
	await writeToFileAsJSON(jsonObj);
	await fse.writeFile(path.join(__dirname, 'blog2.json'), JSON.stringify(blogPosts, null, 4));

	// console.log(xmlData.slice(1000))
};
main();
