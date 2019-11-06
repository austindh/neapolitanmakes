import axios from 'axios';
import { IRecipe } from '../../db/interfaces';

export const getRecipesForPost = (postId: number): Promise<IRecipe[]> => {
	return axios.get(`/recipes/${postId}`).then(res => res.data);
}

export const addRecipe = (recipe: IRecipe): Promise<any> => {
	return axios.put('/recipes', { recipe });
}

export const updateRecipe = (recipe: IRecipe): Promise<any> => {
	return axios.post('/recipes', { recipe });
}

export const deleteRecipe = (recipe: IRecipe): Promise<any> => {
	return axios.delete(`/recipes/${recipe.id}`);
}
