import axios from 'axios';

let tagsCached;

export const getAllTags = () => {
	if (!tagsCached) {
		tagsCached = axios.get('/posttags').then(res => res.data);
	}
	return tagsCached;
};
