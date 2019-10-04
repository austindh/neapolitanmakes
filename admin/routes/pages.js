const express = require( 'express' );
const router = express.Router();

const db = require('../db');

router.get( '/', async ( req, res ) => {

	const pages = await db.getPages();
	
	res.writeHead( 200, { 'Content-Type': 'application/json' });
	res.end( JSON.stringify(pages) );

});

// add new page
router.put('/', async (req, res) => {
	const newPage = await db.createPage();

	res.writeHead( 200, { 'Content-Type': 'application/json' });
	res.end( JSON.stringify(newPage) );
});

// update
router.post('/', async (req, res) => {
	const { post: page } = req.body;
	await db.updatePage(page);

	res.writeHead( 200, { 'Content-Type': 'text/plain' });
	res.end('OK');
});

// delete
router.delete('/:id', async (req, res) => {
	const { id } = req.params;
	await db.deletePage(id);

	res.writeHead( 200, { 'Content-Type': 'text/plain' });
	res.end('OK');
});

module.exports = router;
