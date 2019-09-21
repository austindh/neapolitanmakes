const express = require('express');
const fs = require('fs');
const { exec } = require('child_process');

const PORT = 8082;
const app = express();

app.listen(PORT, () => {
	console.log( `App running on http://localhost:${PORT}` );
});

const bodyParser = require( 'body-parser' );
app.use( bodyParser.json({ limit: '50mb' }) );

app.use('/', express.static('docs'));
app.use('/admin', express.static('admin/public'));

app.use('/posts', require('./admin/routes/posts'));
app.use('/pages', require('./admin/routes/pages'));
app.use('/images', require('./admin/routes/images'));

// to use React routing
app.use( '*', function( req, res ) {
	res.sendFile( __dirname + '/admin/index.html' );
});



let running = false;
let waiting = false;
function buildWebpack() {
	if (running) {
		waiting = true;
		return;
	}

	waiting = false;
	console.log( 'running webpack...' );
	exec('webpack', (err, stdout, stderr) => {
		if (err) {
			console.log( 'err:', err );
		} else {
			console.log( stdout );
			running = false;
			if (waiting) {
				buildWebpack();
			}
		}
	});
}
