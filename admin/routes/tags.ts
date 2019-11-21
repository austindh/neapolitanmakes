import * as express from 'express';
const router = express.Router();

import { db } from '../db';

// get all tags
router.get( '/', async ( req, res ) => {
	const tags = await db.getAllTags();

	res.writeHead( 200, { 'Content-Type': 'application/json' });
	res.end( JSON.stringify(tags) );
});

// add new tag
router.put('/', async(req, res) => {
	const { name, categoryId } = req.body;
	await db.addTagIfNeeded(name, categoryId);

	res.writeHead( 200, { 'Content-Type': 'text/plain' });
	res.end('OK');
});

// update tags for post
router.post('/post', async (req, res) => {
	const { postId, tagIds } = req.body;

	await db.updatePostTags(postId, tagIds);

	res.writeHead( 200, { 'Content-Type': 'text/plain' });
	res.end('OK');
});

// update
router.post('/', async (req, res) => {
	const { tag } = req.body;
	await db.updateTag(tag);

	res.writeHead( 200, { 'Content-Type': 'text/plain' });
	res.end('OK');
});

// delete
router.delete('/:id', async (req, res) => {
	const { id } = req.params;
	await db.deleteTag(id);

	res.writeHead( 200, { 'Content-Type': 'text/plain' });
	res.end('OK');
});

module.exports = router;