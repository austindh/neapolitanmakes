const express = require( 'express' );
const router = express.Router();
const path = require('path');
const fse = require('fs-extra');

const tempPath = path.resolve(__dirname, '../temp/');

router.post( '/', async ( req, res ) => {

	const { imageData, filename } = req.body;
	fse.writeFile(path.join(tempPath, filename), imageData, 'base64', err => {
		if (err) {
			res.writeHead( 500, { 'Content-Type': 'application/json' });
			res.end( JSON.stringify( err ) );
		} else {
			res.writeHead( 200, { 'Content-Type': 'text/plain' });
			res.end( 'OK' );
		}
	});

});

module.exports = router;
