import React, { useState, useEffect } from 'react';

import { getRecipesForPost } from '../js/recipes';
import './RecipesList.scss';
import RecipeEditor from './RecipeEditor';
import { IRecipe } from '../../db/interfaces';

interface RecipesListProps {
	postId: number;
	onRecipesLoad: (recipes: IRecipe[]) => void;
	onRecipeAdd: (recipe: IRecipe) => void;
}

function RecipesList(props: RecipesListProps) {

	const { postId, onRecipesLoad } = props;
	const EMPTY_RECIPE = { postId };
	const [recipes, setRecipes] = useState<IRecipe[]>([]);
	const [editorOpen, setEditorOpen] = useState(false);
	const [selectedRecipe, setSelectedRecipe] = useState(EMPTY_RECIPE);

	useEffect(() => {
		if (postId) {
			getRecipesForPost(postId).then(r => {
				setRecipes(r);
				onRecipesLoad(r);
			});
		}
	}, [postId]);

	const newRecipe = () => {
		setSelectedRecipe(EMPTY_RECIPE);
		setEditorOpen(true);
	}

	const addRecipe = (e, recipe) => {
		e.stopPropagation();
		props.onRecipeAdd(recipe);
	}

	const editRecipe = (recipe) => {
		setSelectedRecipe(recipe);
		setEditorOpen(true);
	}

	const editorClose = () => {
		setEditorOpen(false);
		setSelectedRecipe(EMPTY_RECIPE);
	}

	const recipeEls = recipes.map((r, i) => (
		<div key={i} className="recipe-chip" onClick={() => editRecipe(r)}>
			<span className="name">{r.title}</span>
			<span className="insert" onClick={e => addRecipe(e, r)}>+</span>
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
			<RecipeEditor isOpen={editorOpen} onClose={editorClose} recipe={selectedRecipe} />
		</React.Fragment>
	);
}

export default RecipesList;
