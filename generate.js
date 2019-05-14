// Generate all blog posts
const glob = require('glob');
const fse = require('fs-extra');
const { markdown } = require('markdown');

const { getPageHtml } = require('./build/js/Page');
const { getPostHtml } = require('./build/js/Post');

const getDateString = (day, month, year) => {
	const pad = x => x.toString().padStart(2, '0');
	return `${year}${pad(month)}${pad(day)}`;
};


async function main() {

	console.log( 'generate.js' );

	let posts = glob.sync('./posts/**/*.md');

	// Get post information from folder structure, generate clean urls
	posts = posts.map(post => {
		let [title, day, month, year] = post.split('/').reverse();
		const dateString = getDateString(day, month, year); // used to lookup images

		const date = new Date();
		date.setFullYear(year);
		date.setMonth(month - 1);
		date.setDate(day);

		const htmlPath = `/${year}/${month}/`;
		const filePath = `docs${htmlPath}`;
	
		title = title.split('.')[0];
		const shortUrl = title.replace(/[^\w\s]/g, '').toLowerCase().split(/\s+/).join('-');
	
		return { title, date, path: post, filePath, shortUrl, dateString, fullUrl: '../..' + htmlPath + shortUrl + '.html'};
	});

	// sort with newest first
	posts.sort((a, b) => a.date > b.date ? -1 : 1);
	
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
	
	 
	// Make sure necessary folders for output are created
	const createFolders = posts.map(p => {
		return fse.ensureDir(p.filePath);
	});
	await Promise.all(createFolders);
	await fse.ensureDir('docs/img/');

	// Rename images, create modified image lookup and copy over to new folder
	// TODO do resizing here, creating multiple image sizes (normal, thumbnail, etc.)
	let pictures = glob.sync('./posts/**/*.{jpg,png}');
	const picLookup = {};
	pictures.forEach(filePath => {
		const [fileName, day, month, year] = filePath.split('/').reverse();
		const dateString = getDateString(day, month, year);
		if (!picLookup[dateString]) {
			picLookup[dateString] = {};
		}

		const newFilePath = '../../img/';
		const newFileName = `${dateString}_${fileName}`;
		picLookup[dateString][fileName] = newFilePath + newFileName;

		fse.copy(filePath, `docs/img/${newFileName}`);
	});

	// Create html files
	for (let post of posts) {
		const { filePath, shortUrl, path, dateString, title, next, prev, date } = post;

		const markdownText = (await fse.readFile(path)).toString();
		
		// convert markdown to html, replacing images with updated images
		const updateImages = entry => {

			if (entry[0] === 'img') {
				const data = entry[1];
				data.href = picLookup[dateString][data.href];
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
		const pageHtml = getPageHtml(postHtml);

		await fse.writeFile(`${filePath}${shortUrl}.html`, pageHtml);
	}


}


main();
