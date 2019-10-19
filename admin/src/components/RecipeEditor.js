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
		const copy = JSON.parse(JSON.stringify(Object.assign(blankRecipe, recipe)));
		setCurrentRecipe(copy);
	}, [recipe]);

	const updateTitle = e => setCurrentRecipe({ ...currentRecipe, title: e.target.value })
	const updateYields = e => setCurrentRecipe({ ...currentRecipe, yield: e.target.value })
	const updateTime = e => setCurrentRecipe({ ...currentRecipe, time: e.target.value })

	const { ingredients, steps } = currentRecipe;

	const editIngredientAmount = (e, i) => {
		const { ingredients } = currentRecipe;
		ingredients[i].amount = e.target.value;
		setCurrentRecipe({ ...currentRecipe, ingredients });
	}

	const editIngredientName = (e, i) => {
		const { ingredients } = currentRecipe;
		ingredients[i].name = e.target.value;
		setCurrentRecipe({ ...currentRecipe, ingredients });
	}

	const newIngredient = () => {
		const { ingredients } = currentRecipe;
		ingredients.push({ amount: '', name: '' });
		setCurrentRecipe({ ...currentRecipe, ingredients });
	}

	const removeIngredient = i => {
		const { ingredients } = currentRecipe;
		ingredients.splice(i, 1);
		setCurrentRecipe({ ...currentRecipe, ingredients });
	}

	const moveIngredientUp = i => {
		const { ingredients: ing } = currentRecipe;
		[ing[i - 1], ing[i]] = [ing[i], ing[i - 1]]
		setCurrentRecipe({ ...currentRecipe, ingredients: ing });
	}

	const moveIngredientDown = i => {
		const { ingredients: ing } = currentRecipe;
		[ing[i + 1], ing[i]] = [ing[i], ing[i + 1]]
		setCurrentRecipe({ ...currentRecipe, ingredients: ing });
	}

	const ingredientRows = ingredients.map((ingredient, i) => (
		<div key={i}>
			<div className="amt">
				<input type="text" value={ingredient.amount} onChange={e => editIngredientAmount(e, i)}></input>
			</div>
			<div className="ingredient">
				<input type="text" value={ingredient.name} onChange={e => editIngredientName(e, i)}></input>
			</div>
			<div className="edit-buttons">
				<button className="remove" onClick={() => removeIngredient(i)}>X</button>
				<button className="up-down" onClick={() => moveIngredientUp(i)} disabled={i === 0}>&#8593;</button>
				<button className="up-down" onClick={() => moveIngredientDown(i)} disabled={i === ingredients.length - 1}>&#8595;</button>
			</div>
		</div>
	));
	ingredientRows.push(<button key="add" className="add" onClick={newIngredient}>+</button>);
	const ingredientsText = ingredients.map(i => [i.amount, i.name].join(' ')).join('\n');


	const editStep = (e, i) => {
		const steps = [...currentRecipe.steps];
		steps[i].description = e.target.value;
		setCurrentRecipe({ ...currentRecipe, steps });
	}

	const newStep = () => {
		const { steps } = currentRecipe;
		steps.push({ description: '' });
		setCurrentRecipe({ ...currentRecipe, steps });
	}

	const removeStep = i => {
		const { steps } = currentRecipe;
		steps.splice(i, 1);
		setCurrentRecipe({ ...currentRecipe, steps });
	}

	const moveStepUp = i => {
		const { steps: s } = currentRecipe;
		[s[i - 1], s[i]] = [s[i], s[i - 1]]
		setCurrentRecipe({ ...currentRecipe, steps: s });
	}

	const moveStepDown = i => {
		const { steps: s } = currentRecipe;
		[s[i + 1], s[i]] = [s[i], s[i + 1]]
		setCurrentRecipe({ ...currentRecipe, steps: s });
	}

	const stepsRows = steps.map((s, i) => (
		<div className="step-edit" key={i}>
			<textarea value={s.description} onChange={e => editStep(e, i)}></textarea>
			<div className="edit-buttons">
				<button className="remove" onClick={() => removeStep(i)}>X</button>
				<button className="up-down" onClick={() => moveStepUp(i)} disabled={i === 0}>&#8593;</button>
				<button className="up-down" onClick={() => moveStepDown(i)} disabled={i === steps.length - 1}>&#8595;</button>
			</div>
		</div>
	));
	stepsRows.push(<button key="add" className="add" onClick={newStep}>+</button>);
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
						<div className="header" onClick={cancelEdit}>
							Ingredients
						</div>
						{ isIngredientEdit ?
							ingredientRows :
							<div className="list" onClick={editIngredients}>{ingredientsText}</div>
						}
					</div>
					<div className="steps" onClick={e => e.stopPropagation()}>
						<div className="header" onClick={cancelEdit}>
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
