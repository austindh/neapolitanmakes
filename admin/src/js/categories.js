import axios from 'axios';

let categoriesCached;

export const getAllCategories = () => {
	if (!categoriesCached) {
		categoriesCached = axios.get('/categories').then(res => res.data);
	}
	return categoriesCached;
};
