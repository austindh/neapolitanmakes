const express = require( 'express' );
const router = express.Router();
const path = require('path');
const fse = require('fs-extra');
const md5 = require('md5');

const imgPath = path.resolve(__dirname, '../../docs/img');
const tempPath = path.resolve(__dirname, '../temp/');

router.post( '/', async ( req, res ) => {

	const { imageData, filename } = req.body;
	const ext = filename.split('.').slice('-1');
	const hashFileName = md5(imageData);
	const [f1, f2] = hashFileName.split(''); // folders from first two chars of md5 hash
	
	const newFileName = [hashFileName, ext].join('.');
	const finalImgFolder = path.join(imgPath, f1, f2);
	const finalImgPath = path.join(finalImgFolder, newFileName);
	await fse.ensureDir(finalImgFolder);
	
	fse.writeFile(finalImgPath, imageData, 'base64', err => {
		if (err) {
			res.writeHead( 500, { 'Content-Type': 'application/json' });
			res.end( JSON.stringify( err ) );
		} else {
			res.writeHead( 200, { 'Content-Type': 'application/json' });
			const response = { 
				path: path.join(f1, f2, newFileName)
			};
			res.end(JSON.stringify(response));
		}
	});

});

module.exports = router;
