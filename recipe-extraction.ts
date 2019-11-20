// To extract all recipes and move them to the new format
import * as path from 'path';
import * as fse from 'fs-extra';

import { db } from './admin/db';
import { IRecipe } from './admin/db/interfaces';

const postsFolder = path.resolve(__dirname, './posts-markdown');
const recipesFolder = path.resolve(__dirname, './recipes-markdown');

const getPostIds = async () => {
	const posts = await db.getPosts();
	return posts.map(p => p.id);
}

interface RecipeFile {
	id: number;
	filePath: string;
}

// get list of all remaining files
const getRecipeFiles = async (): Promise<RecipeFile[]> => {
	const data = await fse.readdir(postsFolder);
	return data.map(a => {
		const id = parseInt(a.split('.md')[0]);
		const filePath = path.join(postsFolder, a);

		return { id, filePath };
	});
}

const getMarkdown = async (filepath: string): Promise<string> => {
	const data = await fse.readFile(filepath);
	return data.toString();
}

const extractToMarkdown = async () => {
	// Extract all posts to markdown files that can then be further processed
	await fse.ensureDir(postsFolder);

	const posts = await db.getPosts();
	for (let post of posts) {
		const fileName = path.join(postsFolder, `${post.id}.md`);
		await fse.writeFile(fileName, post.body);
	}
	console.log('markdown files written');
}

// Find which markdown files have recipes (so we can delete others without)
const determineFilesWithRecipes = async () => {
	const files = await getRecipeFiles();
	for (let file of files) {
		const markdown = await getMarkdown(file.filePath);
		const recipeWords = ['yield', 'makes'];
		if (!recipeWords.some(word => markdown.toLowerCase().includes(word))) {
			console.log(file.id);
		}
	}
}

const parseRecipe = (postId: number, recipeString: string): IRecipe => {

	const lines = recipeString.split('\n');

	const recipe: IRecipe = {
		title: '',
		yield: '',
		time: '',
		postId,
		ingredients: [],
		steps: []
	};

	let titleFound = false;
	let yieldFound = false;
	let timeFound = false;
	let ingredients = false;

	while (lines.length) {
		let line = lines.shift() || '';

		// Get title
		if (!titleFound) {
			if (!line.trim()) continue;

			recipe.title = line;
			titleFound = true;
			continue;
		}

		// Get Yield/Time
		if (!yieldFound || !timeFound) {
			if (!line.trim()) continue;

			const lineVal = line.toLowerCase();
			if (lineVal.includes('yield') || lineVal.includes('makes')) {
				if (lineVal.includes(':')) {
					line = line.split(':')[1].trim()
				}
				recipe.yield = line;
				yieldFound = true;
				continue;
			} else if (lineVal.includes('time')) {
				if (lineVal.includes(':')) {
					line = line.split(':')[1].trim()
				}
				recipe.time = line;
				timeFound = true;
				continue;
			} else {
				// No yield/time, so onto ingredients
				yieldFound = true;
				timeFound = true;
				continue;
			}
		}

		// Get Ingredients
		let blanksInARow = 0;
		while (!ingredients) {
			if (!line.trim()) {
				blanksInARow++;
			} else {
				blanksInARow = 0;
			}

			// Marker to go from ingredients to steps
			if (blanksInARow === 2) {
				ingredients = true;
				break;
			}

			// split up amount from name
			const ingredientPieces = line.split(/\s+/g);
			const baseUnits = [
				'tbsp',
				'oz',
				'cup',
				'tsp',
				'sheet',
				'stalk',
				'slice'
			];
			const units = new Set();
			baseUnits.forEach(unit => {
				units.add(unit);
				units.add(unit + 's')
			})

			let amount = [];
			let name = [];
			let numFound = false;
			let unitFound = false;
			while (ingredientPieces.length) {
				let i = ingredientPieces.shift() || '';
				if (!i.length) {
					continue;
				}
				if (!numFound) {
					const nums = [];
					while (i.match(/[0-9]/g) || i.match('to')) {
						nums.push(i);
						i = ingredientPieces.shift();
					}
					ingredientPieces.unshift(i);
					numFound = true;
					amount.push(nums.join(' '));
					continue;
				}

				if (!unitFound) {
					let normalized = i.split('').filter(x => x.match(/[a-z]/i)).join('');
					if (units.has(normalized)) {
						unitFound = true;
						amount.push(normalized);
						continue;
					}
				}

				unitFound = true;
				name.push(i);
			}

			recipe.ingredients.push({ amount: amount.join(' '), name: name.join(' ') });
			line = lines.shift() || '';
		}
		// Trim empty recipe steps from beginning/end
		while(!recipe.ingredients[0].name) {
			recipe.ingredients.shift();
		}
		while (!recipe.ingredients[recipe.ingredients.length - 1].name) {
			recipe.ingredients.pop();
		}

		// Get Steps
		if (!line.trim()) continue;

		// trim any step numbers off beginning
		const chars = line.split('');
		while (!chars[0].match(/[a-z\*]/i)) {
			chars.shift();
		}
		line = chars.join('');


		recipe.steps.push({ description: line.trim() });

	}

	if (!recipe.steps.length) {
		throw `can't find steps for ${recipe.title}`
	}

	return recipe;
}

const parseRecipes = async (id: number) => {
	const markdown = await getMarkdown(path.join(recipesFolder, `${id}.md`));
	const recipes = markdown.split('---').map(r => parseRecipe(id, r));
	return recipes;
};

const writeRecipeJson = async (id: number, recipes: IRecipe[]) => {
	await fse.writeFile(path.join(recipesFolder, `${id}.json`), JSON.stringify(recipes, null, 4));
}

const main = async () => {
	// await extractToMarkdown();
	// await determineFilesWithRecipes();
	const ID = 8;
	const recipes = await parseRecipes(ID);
	await writeRecipeJson(ID, recipes);

};
main();
