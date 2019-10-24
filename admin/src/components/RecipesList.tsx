import React, { useState, useEffect } from 'react';

import { getRecipesForPost } from '../js/recipes';
import './RecipesList.scss';
import RecipeEditor from './RecipeEditor';

function RecipesList({ postId }) {

	const EMPTY_RECIPE = { postId };
	const [recipes, setRecipes] = useState<any>([]);
	const [editorOpen, setEditorOpen] = useState(false);
	const [selectedRecipe, setSelectedRecipe] = useState(EMPTY_RECIPE);

	useEffect(() => {
		if (postId) {
			getRecipesForPost(postId).then(r => {
				setRecipes(r);
			});
		}
	}, [postId]);

	const newRecipe = () => {
		console.log('new recipe');
		setSelectedRecipe(EMPTY_RECIPE);
		setEditorOpen(true);
	}

	const addRecipe = (e) => {
		e.stopPropagation();
		console.log('ADD');
	}

	const editRecipe = (recipe) => {
		setSelectedRecipe(recipe);
		setEditorOpen(true);
		console.log('EDIT');
	}

	const editorClose = () => {
		setEditorOpen(false);
		setSelectedRecipe(EMPTY_RECIPE);
	}

	const recipeEls = recipes.map((r, i) => (
		<div key={i} className="recipe-chip" onClick={() => editRecipe(r)}>
			<span className="name">{r.title}</span>
			<span className="insert" onClick={addRecipe}>+</span>
		</div>
	));

	return (
		<React.Fragment>
			<div id="recipes-list">
				<div className="title">Recipes</div>
				<div className="recipes">
					{ recipeEls }
				</div>
				<button className="primary" onClick={newRecipe}>New +</button>
			</div>
			<RecipeEditor isOpen={editorOpen} onClose={editorClose} recipe={selectedRecipe}></RecipeEditor>
		</React.Fragment>
	);
}

export default RecipesList;
