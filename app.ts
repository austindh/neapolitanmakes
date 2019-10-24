import * as express from 'express';

const PORT = 8082;
const app = express();

app.listen(PORT, () => {
	console.log( `App running on http://localhost:${PORT}` );
});

const bodyParser = require( 'body-parser' );
app.use( bodyParser.json({ limit: '50mb' }) );

app.use('/posts', require('./admin/routes/posts'));
app.use('/pages', require('./admin/routes/pages'));
app.use('/posttags', require('./admin/routes/tags'));
app.use('/categories', require('./admin/routes/categories'));
app.use('/recipes', require('./admin/routes/recipes'));
app.use('/images', require('./admin/routes/images'));
app.use('/build', require('./admin/routes/build'));

app.use('/', express.static('docs', { extensions: ['html'] }));
app.use('/admin', express.static('admin/public'));


// to use React routing
app.use( '*', function( req, res ) {
	res.sendFile( __dirname + '/admin/index.html' );
});
