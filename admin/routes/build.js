const express = require( 'express' );
const router = express.Router();
const { exec } = require('child_process');

const build = () => {
	return new Promise((resolve, reject) => {
		exec('npm run build:js --prefix admin', (err, stdout) => {
			if (err) {
				reject(err);
			} else {
				resolve();
			}
		});
	});
}

// To trigger npm build process from admin
router.post( '/', async ( req, res ) => {

	await build();

	res.writeHead( 200, { 'Content-Type': 'text/plain' });
	res.end('OK');
});

module.exports = router;
