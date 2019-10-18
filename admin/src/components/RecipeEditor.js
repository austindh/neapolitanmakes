import React , { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

import Modal from './Modal';
import './RecipeEditor.scss';

function RecipeEditor({ recipe, isOpen, onClose }) {

	const [currentRecipe, setCurrentRecipe] = useState({ ingredients: [], steps: [] });
	const [isIngredientEdit, setIngredientEdit] = useState(false);
	const [isStepsEdit, setStepsEdit] = useState(false);

	useEffect(() => {
		const blankRecipe = {
			title: '',
			yield: '',
			time: '',
			ingredients: [],
			steps: []
		};
		setCurrentRecipe(Object.assign(blankRecipe, recipe));
	}, [recipe]);

	const updateTitle = e => setCurrentRecipe({ ...currentRecipe, title: e.target.value })
	const updateYields = e => setCurrentRecipe({ ...currentRecipe, yield: e.target.value })
	const updateTime = e => setCurrentRecipe({ ...currentRecipe, time: e.target.value })

	const { ingredients, steps } = currentRecipe;

	const ingredientRows = ingredients.map((ingredient, i) => (
		<div key={i}>
			<div className="amt">
				<input type="text" value={ingredient.amount} onChange={() => {}}></input>
			</div>
			<div className="ingredient">
				<input type="text" value={ingredient.name} onChange={() => {}}></input>
			</div>
		</div>
	));
	const ingredientsText = ingredients.map(i => [i.amount, i.name].join(' ')).join('\n');


	const stepsRows = steps.map((s, i) => (
		<div key={i}>
			<input type="text" value={s.description} onChange={() => {}}></input>
		</div>
	));
	const stepsText = steps.map((s, i) => (
		<div key={i} className="step">{`${i + 1}. ${s.description}`}</div>
	));

	const cancelEdit = () => {
		setIngredientEdit(false);
		setStepsEdit(false);
	}

	const editIngredients = e => {
		e.stopPropagation();
		setStepsEdit(false);
		setIngredientEdit(true);
	}

	const editSteps = e => {
		e.stopPropagation();
		setStepsEdit(true);
		setIngredientEdit(false);
	}

	const close = () => {
		setStepsEdit(false);
		setIngredientEdit(false);
		onClose();
	}

	const modal = ReactDOM.createPortal(
		<Modal open={isOpen} onClose={close}>
			<div id="recipe-editor" onClick={cancelEdit}>
				<div className="title">Recipe Editor</div>
				<div className="body">
					<div className="input-row">
						<label>
							<span>Title</span>
							<input type="text" value={currentRecipe.title || ''} onChange={updateTitle}></input>
						</label>
					</div>
					<div className="input-row">
						<label>
							<span>Yields</span>
							<input type="text" value={currentRecipe.yield || ''} onChange={updateYields}></input>
						</label>
						<label>
							<span>Time</span>
							<input type="text" value={currentRecipe.time || ''} onChange={updateTime}></input>
						</label>
					</div>
					<div className="ingredients" onClick={e => e.stopPropagation()}>
						<div className="header">
							Ingredients
						</div>
						{ isIngredientEdit ?
							ingredientRows :
							<div className="list" onClick={editIngredients}>{ingredientsText}</div>
						}
					</div>
					<div className="steps" onClick={e => e.stopPropagation()}>
						<div className="header">
							Steps
						</div>
						{ isStepsEdit ?
							stepsRows :
							<div className="list" onClick={editSteps}>{stepsText}</div>
						}
					</div>
				</div>
				<div className="buttons">
					<button onClick={close}>Cancel</button>
				</div>
			</div>
		</Modal>,
		document.getElementById('modal')
	);

	return modal;
}

export default RecipeEditor;
