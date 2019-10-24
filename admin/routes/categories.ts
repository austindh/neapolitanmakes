import * as express from 'express';
const router = express.Router();

import { db } from '../db';

router.get( '/', async ( req, res ) => {
	const categories = await db.getCategories();
	
	res.writeHead( 200, { 'Content-Type': 'application/json' });
	res.end( JSON.stringify(categories) );
});

// router.post('/post', async (req, res) => {
// 	const { postId, tagIds } = req.body;

// 	await db.updatePostTags(postId, tagIds);

// 	res.writeHead( 200, { 'Content-Type': 'text/plain' });
// 	res.end('OK');
// });

// // add new tag
// router.put('/', async (req, res) => {
// 	const newPost = await db.createPost();

// 	res.writeHead( 200, { 'Content-Type': 'application/json' });
// 	res.end( JSON.stringify(newPost) );
// });

// // update
// router.post('/', async (req, res) => {
// 	const { post } = req.body;
// 	await db.updatePost(post);

// 	res.writeHead( 200, { 'Content-Type': 'text/plain' });
// 	res.end('OK');
// });

// // delete
// router.delete('/:id', async (req, res) => {
// 	const { id } = req.params;
// 	await db.deletePost(id);

// 	res.writeHead( 200, { 'Content-Type': 'text/plain' });
// 	res.end('OK');
// });

module.exports = router;
