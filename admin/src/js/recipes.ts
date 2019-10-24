import axios from 'axios';

export const getRecipesForPost = postId => {
	return axios.get(`/recipes/${postId}`).then(res => res.data);
}
