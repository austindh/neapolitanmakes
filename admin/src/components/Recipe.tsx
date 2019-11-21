import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { IRecipe } from '../../db/interfaces';

export const recipeTagRegex = /({{recipe_\d+}})/g;

export const getRecipeHtml = (recipe: IRecipe): string => {

	const ingredients = recipe.ingredients.map((ingredient, i) => (
		<div className="recipe-ingredient" key={i}>
			<span className="amount">{ ingredient.amount }</span>
			<span className="name">{ ingredient.name }</span>
		</div>
	));
	
	const steps = recipe.steps.map((s, i) => (
		<div key={i} className="recipe-step">
			<span className="number">{ i + 1 }.</span>
			<span>{ s.description }</span>
		</div>
	));

	return renderToStaticMarkup(
		<div className="recipe card">
			<div className="recipe-title">{ recipe.title }</div>
			<div className="recipe-summary">
				{recipe.yield && 
					<div><span>Yields:</span>{ recipe.yield }</div>
				}
				{recipe.time &&
					<div><span>Time:</span>{ recipe.time }</div>
				}
			</div>
			<div className="recipe-ingredients">
				{ ingredients }
			</div>
			<div className="recipe-steps">
				{ steps }
			</div>
		</div>
	);
}
