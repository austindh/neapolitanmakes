// generate slightly bigger thumbnails for blogger posts
const path = require('path');
const sharp = require('sharp');
let posts = require('./blog2.json');
const axios = require('axios');
const fse = require('fs-extra');
const db = require('../admin/db');

const testDir = path.resolve(__dirname, './img');

const downloadAndSaveImage = (url, filePath) => {
	return axios.get(url,{ responseType: 'stream' }).then(res => {
		
		return new Promise((resolve, reject) => {
			res.data
				.pipe(fse.createWriteStream(filePath))
				.on('finish', resolve)
				.on('error', e => reject(e));
		});

		// return fse.writeFile(filePath, res.data);
	});
}

const downloadAndCreateThumbnails = async () => {

	// TEMP
	// posts = posts.slice(0, 1);

	let i = 1;
	let total = posts.length;
	for (let post of posts) {
		console.log(`downloading ${i++} of ${total}`);
		const [firstImage] = post.images;
		const filePath = path.join(testDir, `${post.cleanTitle}-full.jpg`);
		const thumbPath = path.join(testDir, `${post.cleanTitle}.jpg`);
		await downloadAndSaveImage(firstImage, filePath);
		await sharp(filePath).resize(200, 200, {
			fit: 'inside'
		}).toFile(thumbPath);
		await fse.remove(filePath);
	}

};

const destDir = path.resolve(__dirname, '../docs/img/blogger');
const moveThumbnailsAndUpdatePosts = async () => {
	// const paths = await fse.readdir(testDir);
	// for (let img of paths) {
	// 	const src = path.join(testDir, img);
	// 	const dest = path.join(destDir, img);
	// 	await fse.move(src, dest);
	// }

	const paths = await fse.readdir(destDir);
	for (let img of paths) {
		img = img.split('.jpg')[0];
		const post = await db.getPostByCleanTitle(img);
		post.thumbnail = `img/blogger/${img}.jpg`;
		await db.updatePost(post);
	}
};
moveThumbnailsAndUpdatePosts();
// downloadAndCreateThumbnails();
