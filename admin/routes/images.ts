import * as express from 'express';
const router = express.Router();
const path = require('path');
const fse = require('fs-extra');
const md5 = require('md5');
const sharp = require('sharp');

const imgPath = path.resolve(__dirname, '../../docs/img');
const tempPath = path.resolve(__dirname, '../temp/');

router.post( '/', async ( req, res ) => {

	const { imageData, filename } = req.body;
	const ext = filename.split('.').slice('-1');
	const hashFileName = md5(imageData);
	const [f1, f2] = hashFileName.split(''); // folders from first two chars of md5 hash
	
	const newFileName = [hashFileName, ext].join('.');
	const newThumbName = [hashFileName + '-thumb', ext].join('.');
	const finalImgFolder = path.join(imgPath, f1, f2);
	const finalImgPath = path.join(finalImgFolder, newFileName);
	const finalImgThumbPath = path.join(finalImgFolder, newThumbName);
	await fse.ensureDir(finalImgFolder);
	
	fse.writeFile(finalImgPath, imageData, 'base64', async (err) => {
		if (err) {
			res.status(500).json(err);
		} else {
			await sharp(finalImgPath).resize(200, 200, {
				fit: 'inside'
			}).toFile(finalImgThumbPath);
			const response = { 
				path: path.join(f1, f2, newFileName)
			};
			res.json(response);
		}
	});

});

module.exports = router;
