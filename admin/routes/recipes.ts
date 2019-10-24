const express = require('express');
import * as express from 'express';
const router = express.Router();

import { db } from '../db';

// Get recipes for post
router.get('/:postId', async (req, res) => {
	const { postId } = req.params;
	const recipes = await db.getRecipesForPost(postId);
	res.json(recipes);
});

// add new recipe
router.put('/', async (req, res) => {
	const { recipe } = req.body;
	const id = await db.insertRecipe(recipe);
	res.json({ id });
});

// update recipe
router.post('/', async (req, res) => {
	const { recipe } = req.body;
	await db.updateRecipe(recipe);
	res.send('OK');
});

// delete recipe
router.delete('/:id', async (req, res) => {
	const { id } = req.params;
	await db.deleteRecipe(id);
	res.send('OK');
});

module.exports = router;
