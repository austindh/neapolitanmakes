const express = require( 'express' );
const router = express.Router();
const builder = require('../../admin_old/builder');

const db = require('../db');

router.get( '/', async ( req, res ) => {

	const posts = await db.getPosts();
	
	res.writeHead( 200, { 'Content-Type': 'application/json' });
	res.end( JSON.stringify(posts) );

});

// add new post
router.put('/', async (req, res) => {
	const newPost = await db.createPost();

	builder.build();

	res.writeHead( 200, { 'Content-Type': 'application/json' });
	res.end( JSON.stringify(newPost) );
});

// update
router.post('/', async (req, res) => {
	const { post } = req.body;
	await db.updatePost(post);

	builder.build();

	res.writeHead( 200, { 'Content-Type': 'text/plain' });
	res.end('OK');
});

// delete
router.delete('/:id', async (req, res) => {
	const { id } = req.params;
	await db.deletePost(id);

	builder.build();

	res.writeHead( 200, { 'Content-Type': 'text/plain' });
	res.end('OK');
});

module.exports = router;
