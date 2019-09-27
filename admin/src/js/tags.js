import axios from 'axios';

let tagsCached;

export const getAllTags = () => {
	if (!tagsCached) {
		tagsCached = axios.get('/tags').then(res => res.data);
	}
	return tagsCached;
};
