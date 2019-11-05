import axios from 'axios';
import { IRecipe } from '../../db/interfaces';

export const getRecipesForPost = (postId: number): Promise<IRecipe[]> => {
	return axios.get(`/recipes/${postId}`).then(res => res.data);
}
